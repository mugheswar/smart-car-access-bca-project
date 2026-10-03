import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { vehicleService } from '../services/vehicleService';
import { Vehicle } from '../types';
import { VehicleCard } from '../components/VehicleCard';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { useToast } from '../context/ToastContext';
import { Plus, Car, Search, ArrowLeft } from 'lucide-react';

const CAR_BRANDS = [
  { id: 'hyundai', name: 'Hyundai', domain: 'hyundai.com', img_id: 'hyundai' },
  { id: 'tata', name: 'Tata Motors', domain: 'tatamotors.com', img_id: 'tata' },
  { id: 'mahindra', name: 'Mahindra', domain: 'mahindra.com', img_id: 'mahindra' },
  { id: 'maruti', name: 'Maruti Suzuki', domain: 'marutisuzuki.com', img_id: 'suzuki' },
  { id: 'toyota', name: 'Toyota', domain: 'toyota.com', img_id: 'toyota' },
  { id: 'honda', name: 'Honda', domain: 'honda.com', img_id: 'honda' },
  { id: 'kia', name: 'Kia', domain: 'kia.com', img_id: 'kia' },
  { id: 'mg', name: 'MG Motor', domain: 'mgmotor.co.in', img_id: 'mg' },
  { id: 'vw', name: 'Volkswagen', domain: 'volkswagen.com', img_id: 'volkswagen' },
  { id: 'skoda', name: 'Skoda', domain: 'skoda-auto.com', img_id: 'skoda' },
  { id: 'bmw', name: 'BMW', domain: 'bmw.com', img_id: 'bmw' },
  { id: 'mercedes', name: 'Mercedes-Benz', domain: 'mercedes-benz.com', img_id: 'mercedes-benz' },
  { id: 'audi', name: 'Audi', domain: 'audi.com', img_id: 'audi' },
  { id: 'tesla', name: 'Tesla', domain: 'tesla.com', img_id: 'tesla' },
  { id: 'ford', name: 'Ford', domain: 'ford.com', img_id: 'ford' },
  { id: 'renault', name: 'Renault', domain: 'renault.com', img_id: 'renault' },
  { id: 'nissan', name: 'Nissan', domain: 'nissan-global.com', img_id: 'nissan' },
  { id: 'porsche', name: 'Porsche', domain: 'porsche.com', img_id: 'porsche' },
  { id: 'lexus', name: 'Lexus', domain: 'lexus.com', img_id: 'lexus' },
  { id: 'jaguar', name: 'Jaguar', domain: 'jaguar.com', img_id: 'jaguar' },
  { id: 'landrover', name: 'Land Rover', domain: 'landrover.com', img_id: 'land-rover' },
  { id: 'volvo', name: 'Volvo', domain: 'volvo.com', img_id: 'volvo' },
  { id: 'chevrolet', name: 'Chevrolet', domain: 'chevrolet.com', img_id: 'chevrolet' },
  { id: 'jeep', name: 'Jeep', domain: 'jeep.com', img_id: 'jeep' },
];

export const VehiclesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isSetup = searchParams.get('setup') === 'true';

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // addStep: 0 = list view, 1 = brand grid, 2 = vehicle form
  const [addStep, setAddStep] = useState<number>(isSetup ? 1 : 0);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Brand Grid State
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [registration, setRegistration] = useState('');
  const [brand, setBrand] = useState('Hyundai');
  const [model, setModel] = useState('');
  const [type, setType] = useState('SUV');
  const [year, setYear] = useState(2025);
  const [color, setColor] = useState('Polar White');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();

  const fetchVehicles = async () => {
    try {
      const data = await vehicleService.getVehicles();
      setVehicles(data);
    } catch (err) {
      showToast('Error', 'Unable to retrieve vehicle list.', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registration || !brand || !model) {
      showToast('Validation Error', 'Registration number, brand and model are required.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const newVehicle = await vehicleService.createVehicle({
        registrationNumber: registration.toUpperCase(),
        brand,
        model,
        type,
        year: Number(year),
        color,
      });
      setVehicles((prev) => [...prev, newVehicle]);
      showToast('Vehicle Enrolled', `${brand} ${model} registered to your telematics account.`, 'success');
      
      // Reset
      setAddStep(0);
      setRegistration('');
      setModel('');

      if (isSetup) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to register vehicle.';
      showToast('Registration Error', msg, 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await vehicleService.deleteVehicle(deleteId);
      setVehicles((prev) => prev.filter((v) => v.id !== deleteId));
      showToast('Vehicle Deleted', 'The vehicle profile has been detached.', 'info');
    } catch (err: any) {
      showToast('Deletion Failed', err.response?.data?.detail || 'Could not delete vehicle.', 'danger');
    } finally {
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return <LoadingSpinner label="Fetching Vehicle Registry..." />;
  }

  const filteredBrands = CAR_BRANDS.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // VIEW 1: BRAND SELECTOR GRID
  if (addStep === 1) {
    return (
      <div className="flex flex-col h-[calc(100vh-100px)] animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center gap-4 pb-6">
          {!isSetup && (
            <button
              onClick={() => setAddStep(0)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1 text-center pr-10">
            <h1 className="text-3xl font-bold text-white tracking-tight">Select Vehicle Make</h1>
            <p className="text-sm text-slate-400 mt-1">Choose your vehicle manufacturer to begin registration</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto w-full mb-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
          <input
            type="text"
            placeholder="Type brand name to filter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-4 py-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-base focus:outline-none focus:border-cyan-500 transition-colors shadow-lg shadow-black/20"
          />
        </div>

        <div className="flex-1 overflow-y-auto pb-10 custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 max-w-7xl mx-auto">
            {filteredBrands.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setBrand(b.name);
                  setAddStep(2);
                }}
                className="flex flex-col items-center justify-center p-6 rounded-2xl hover:bg-slate-800/50 transition-all group"
              >
                <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-105 transition-transform duration-300 overflow-hidden mb-4 border border-slate-700 p-3">
                  <img
                    src={`https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/${b.img_id}.png`}
                    alt={b.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://logo.clearbit.com/${b.domain}`;
                    }}
                  />
                </div>
                <span className="text-sm font-bold text-slate-300 group-hover:text-white text-center">
                  {b.name}
                </span>
              </button>
            ))}
          </div>
          {filteredBrands.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              No brands found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    );
  }

  // VIEW 2: VEHICLE FORM
  if (addStep === 2) {
    return (
      <div className="max-w-2xl mx-auto py-8 animate-in slide-in-from-right-8 duration-300">
        <button
          onClick={() => setAddStep(1)}
          className="mb-6 flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Brands
        </button>
        
        <div className="glass-panel rounded-3xl p-8 border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-800/80">
            <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-lg overflow-hidden border border-slate-700 p-2">
              <img
                src={`https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb/${CAR_BRANDS.find(c => c.name === brand)?.img_id || 'hyundai'}.png`}
                alt={brand}
                className="w-full h-full object-contain"
                onError={(e) => {
                   (e.target as HTMLImageElement).src = `https://logo.clearbit.com/${CAR_BRANDS.find(c => c.name === brand)?.domain || 'hyundai.com'}`;
                }}
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Register {brand}</h2>
              <p className="text-sm text-slate-400 mt-1">Configure your telematics profile</p>
            </div>
          </div>

          <form onSubmit={handleCreateVehicle} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Model Name</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Creta, Nexon..."
                  required
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Registration Number
                </label>
                <input
                  type="text"
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value)}
                  placeholder="e.g. TN 07 CS 4921"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs font-mono uppercase focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Vehicle Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="SUV">SUV</option>
                  <option value="Compact SUV">Compact SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="EV">Electric Vehicle (EV)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Year</label>
                <input
                  type="number"
                  min="1990"
                  max="2030"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="White"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-900/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Car className="w-4 h-4" />
                {isSubmitting ? 'Enrolling...' : 'Complete Vehicle Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // VIEW 0: VEHICLE LIST
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
            Telematics Garage
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Registered Vehicles
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your connected smart vehicles for simulated keyless entry
          </p>
        </div>

        <button
          onClick={() => setAddStep(1)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-950/40 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Grid of Vehicles */}
      {vehicles.length === 0 ? (
        <EmptyState
          icon={Car}
          title="No Vehicles Registered"
          description="You do not have any vehicles configured yet. Add a vehicle profile to begin simulated access testing."
          actionText="Add Vehicle Profile"
          onAction={() => setAddStep(1)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              onDelete={(id) => setDeleteId(id)}
              canDelete={true}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Vehicle Profile"
        message="Are you sure you wish to remove this vehicle? This action will remove the vehicle from your telematics profile."
        confirmText="Remove Vehicle"
        isDestructive={true}
      />
    </div>
  );
};
