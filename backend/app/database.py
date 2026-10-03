import os
import json
import uuid
import threading
from pathlib import Path
from typing import Dict, Any, List, Optional, Callable
from app.config import settings

class LocalCollection:
    """Thread-safe, JSON file-persisted document collection simulating MongoDB."""
    def __init__(self, collection_name: str, file_path: Path, lock: threading.RLock):
        self.name = collection_name
        self.file_path = file_path
        self._lock = lock
        self._data: List[Dict[str, Any]] = []
        self._load()

    def _load(self):
        with self._lock:
            if self.file_path.exists():
                try:
                    with open(self.file_path, "r", encoding="utf-8") as f:
                        content = f.read().strip()
                        self._data = json.loads(content) if content else []
                except Exception as e:
                    print(f"Error loading {self.file_path}: {e}")
                    self._data = []
            else:
                self._data = []
                self._save()

    def _save(self):
        with self._lock:
            self.file_path.parent.mkdir(parents=True, exist_ok=True)
            temp_file = self.file_path.with_suffix(".tmp")
            with open(temp_file, "w", encoding="utf-8") as f:
                json.dump(self._data, f, indent=2, default=str)
            temp_file.replace(self.file_path)

    def _match(self, doc: Dict[str, Any], query: Dict[str, Any]) -> bool:
        if not query:
            return True
        for key, val in query.items():
            if key == "$or" and isinstance(val, list):
                if not any(self._match(doc, subq) for subq in val):
                    return False
                continue
            if isinstance(val, dict):
                # Simple operator checks
                doc_val = doc.get(key)
                if "$in" in val and doc_val not in val["$in"]:
                    return False
                if "$gte" in val and (doc_val is None or doc_val < val["$gte"]):
                    return False
                if "$lte" in val and (doc_val is None or doc_val > val["$lte"]):
                    return False
                if "$ne" in val and doc_val == val["$ne"]:
                    return False
            else:
                if doc.get(key) != val:
                    return False
        return True

    def find_one(self, query: Dict[str, Any] = None) -> Optional[Dict[str, Any]]:
        with self._lock:
            for doc in self._data:
                if self._match(doc, query or {}):
                    return doc.copy()
            return None

    def find(
        self,
        query: Dict[str, Any] = None,
        sort_by: Optional[str] = None,
        reverse: bool = False,
        skip: int = 0,
        limit: int = 0
    ) -> List[Dict[str, Any]]:
        with self._lock:
            matched = [doc.copy() for doc in self._data if self._match(doc, query or {})]
            if sort_by:
                matched.sort(key=lambda x: str(x.get(sort_by, "")), reverse=reverse)
            if skip > 0:
                matched = matched[skip:]
            if limit > 0:
                matched = matched[:limit]
            return matched

    def insert_one(self, document: Dict[str, Any]) -> Dict[str, Any]:
        with self._lock:
            doc = document.copy()
            if "_id" not in doc:
                doc["_id"] = str(uuid.uuid4())
            self._data.append(doc)
            self._save()
            return doc.copy()

    def insert_many(self, documents: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        with self._lock:
            inserted = []
            for d in documents:
                doc = d.copy()
                if "_id" not in doc:
                    doc["_id"] = str(uuid.uuid4())
                self._data.append(doc)
                inserted.append(doc.copy())
            self._save()
            return inserted

    def update_one(self, query: Dict[str, Any], update_data: Dict[str, Any]) -> bool:
        with self._lock:
            for idx, doc in enumerate(self._data):
                if self._match(doc, query):
                    # Handle $set or direct dict
                    fields_to_update = update_data.get("$set", update_data)
                    for k, v in fields_to_update.items():
                        self._data[idx][k] = v
                    self._save()
                    return True
            return False

    def delete_one(self, query: Dict[str, Any]) -> bool:
        with self._lock:
            for idx, doc in enumerate(self._data):
                if self._match(doc, query):
                    self._data.pop(idx)
                    self._save()
                    return True
            return False

    def delete_many(self, query: Dict[str, Any] = None) -> int:
        with self._lock:
            if not query:
                count = len(self._data)
                self._data = []
                self._save()
                return count
            before = len(self._data)
            self._data = [doc for doc in self._data if not self._match(doc, query)]
            deleted = before - len(self._data)
            if deleted > 0:
                self._save()
            return deleted

    def count_documents(self, query: Dict[str, Any] = None) -> int:
        with self._lock:
            if not query:
                return len(self._data)
            return sum(1 for doc in self._data if self._match(doc, query))


class LocalDatabase:
    """Manages collections stored as local JSON files in the storage directory."""
    def __init__(self, data_dir: str):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self._lock = threading.RLock()
        self._collections: Dict[str, LocalCollection] = {}

    def get_collection(self, name: str) -> LocalCollection:
        with self._lock:
            if name not in self._collections:
                file_path = self.data_dir / f"{name}.json"
                self._collections[name] = LocalCollection(name, file_path, self._lock)
            return self._collections[name]

    @property
    def users(self) -> LocalCollection:
        return self.get_collection("users")

    @property
    def vehicles(self) -> LocalCollection:
        return self.get_collection("vehicles")

    @property
    def access_logs(self) -> LocalCollection:
        return self.get_collection("access_logs")

    @property
    def security_events(self) -> LocalCollection:
        return self.get_collection("security_events")

    @property
    def ai_predictions(self) -> LocalCollection:
        return self.get_collection("ai_predictions")

    @property
    def notifications(self) -> LocalCollection:
        return self.get_collection("notifications")

# Singleton local database instance
db = LocalDatabase(settings.STORAGE_DIR)
