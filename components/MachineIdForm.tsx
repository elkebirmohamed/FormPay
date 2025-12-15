import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, MonitorSmartphone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { FormData, FormErrors, StorageKeys } from '../types';

export const MachineIdForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    machineId: '',
    email: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.machineId.trim()) {
      newErrors.machineId = 'Le Machine ID est requis.';
      isValid = false;
    } else if (formData.machineId.length < 5) {
      newErrors.machineId = 'Le Machine ID semble trop court.';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'adresse e-mail est requise.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Veuillez entrer une adresse e-mail valide.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      
      // Sequence Cruciale: Stockage et Redirection
      try {
        sessionStorage.setItem(StorageKeys.MACHINE_ID, formData.machineId);
        sessionStorage.setItem(StorageKeys.EMAIL, formData.email);
        
        // Simuler un petit délai pour l'UX (feedback visuel)
        setTimeout(() => {
            window.location.href = 'https://www.paypal.com/simulated-checkout-link';
        }, 800);
      } catch (error) {
        console.error("Erreur lors de la sauvegarde session:", error);
        setIsSubmitting(false);
        setErrors({ ...errors, machineId: "Erreur de stockage session. Veuillez réessayer." });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
        {/* Card Header */}
        <div className="bg-slate-900 dark:bg-slate-950 px-8 py-6 text-white border-b border-slate-800 dark:border-slate-900">
          <h2 className="text-2xl font-bold mb-2">Configuration de l'Appareil</h2>
          <p className="text-slate-300 dark:text-slate-400 text-sm">
            Veuillez renseigner les informations de votre terminal POS.AI pour générer votre clé d'activation.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8">
            <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-lg p-4 flex items-start gap-3">
                <div className="text-amber-600 dark:text-amber-500 mt-0.5 shrink-0">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-400">Où trouver mon Machine ID ?</h3>
                    <div className="text-xs text-amber-700 dark:text-amber-500/80 mt-2 space-y-2">
                        <p>
                            • Sur l'<strong>écran de verrouillage</strong> (Lock Screen) de votre terminal.
                        </p>
                        <p>
                            • Ou dans l'application POS.AI :<br/>
                            <span className="font-medium ml-2">Menu Principal &gt; Paramètres &gt; Licence</span>
                        </p>
                    </div>
                </div>
            </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Machine ID Input */}
            <div>
              <label htmlFor="machineId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Machine ID <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <MonitorSmartphone size={18} />
                </div>
                <input
                  type="text"
                  id="machineId"
                  name="machineId"
                  value={formData.machineId}
                  onChange={handleChange}
                  placeholder="ex: POS-8X92-LM45"
                  className={`block w-full pl-10 pr-3 py-3 border ${errors.machineId ? 'border-red-300 dark:border-red-800 focus:ring-red-200 dark:focus:ring-red-900' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-900'} rounded-lg focus:outline-none focus:ring-4 transition-all duration-200 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 font-mono text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600`}
                />
              </div>
              {errors.machineId && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.machineId}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Adresse E-mail <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="vous@entreprise.com"
                  className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-300 dark:border-red-800 focus:ring-red-200 dark:focus:ring-red-900' : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-900'} rounded-lg focus:outline-none focus:ring-4 transition-all duration-200 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600`}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">La clé d'activation sera envoyée à cette adresse.</p>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                     <AlertCircle size={14} /> {errors.email}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${isSubmitting ? 'opacity-75 cursor-wait' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Redirection vers le paiement...
                </>
              ) : (
                <>
                  Procéder au Paiement <ArrowRight size={18} />
                </>
              )}
            </button>
            
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400 dark:text-slate-500">
               <Lock size={12} />
               <span>Vos données sont traitées de manière sécurisée.</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};