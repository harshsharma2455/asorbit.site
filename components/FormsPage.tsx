import React, { useState, FormEvent } from 'react';

// Reusable form input component for consistency
const FormInput: React.FC<{
    id: string;
    name: string;
    type: string;
    label: string;
    autoComplete?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}> = ({ id, name, type, label, autoComplete, value, onChange, error }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
            {label}
        </label>
        <div className="mt-1">
            <input
                type={type}
                name={name}
                id={id}
                autoComplete={autoComplete}
                value={value}
                onChange={onChange}
                className={`block w-full px-4 py-3 bg-white/80 border rounded-lg shadow-sm placeholder-slate-400 transition-shadow
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                            ${error ? 'border-red-400' : 'border-slate-300'}`}
            />
        </div>
        {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
);

// Reusable form select component
const FormSelect: React.FC<{
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
    children: React.ReactNode;
}> = ({ id, name, label, value, onChange, error, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
            {label}
        </label>
        <div className="mt-1 relative">
            <select
                name={name}
                id={id}
                value={value}
                onChange={onChange}
                className={`block w-full px-4 py-3 bg-white/80 border rounded-lg shadow-sm transition-shadow appearance-none
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                            ${error ? 'border-red-400' : 'border-slate-300'} ${!value ? 'text-slate-400' : 'text-slate-900'}`}
            >
                {children}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                 <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
        {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
);


interface FormData {
    name: string;
    email: string;
    resource: string;
}

const ResourcesPage: React.FC = () => {
    const [formStatus, setFormStatus] = useState<'editing' | 'submitted'>('editing');
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        resource: '',
    });
    
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };
    
    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required.';
        if (!formData.email.trim()) {
            newErrors.email = 'Email Address is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please provide a valid email address.';
        }
        if (!formData.resource) newErrors.resource = 'Please select a resource.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
    
        if (validate()) {
            setIsLoading(true);
            try {
                const webhookUrl = 'https://n8n.asorbit.site/webhook/asorbit';
    
                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain' },
                    body: JSON.stringify(formData),
                });
    
                if (!response.ok) {
                    throw new Error(`Webhook submission failed with status: ${response.status}`);
                }

                console.log("Form data submitted:", formData);

                setFormStatus('submitted');
                window.scrollTo(0, 0);
    
            } catch (error: any) {
                console.error('Submission Error:', error);
                setSubmitError(error.message || 'Submission failed. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (formStatus === 'submitted') {
        return (
            <div key="resource-success" className="animate-fadeInUp pt-28 sm:pt-32 pb-16">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-white/60 backdrop-blur-lg p-8 md:p-12 rounded-2xl border border-[var(--border-primary)] shadow-[var(--shadow-custom-lg)]">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                             <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">Check Your Inbox!</h2>
                        <p className="mt-4 text-lg text-slate-600">
                            Your resources are on their way. I've sent an email to <span className="font-semibold text-indigo-600">{formData.email}</span> with your download links.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div key="resources" className="animate-fadeInUp pt-28 sm:pt-32 pb-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
                        Get Your Free Resources
                    </h1>
                    <p className="mt-4 text-xl text-slate-600">
                        Sign up to receive the templates and materials mentioned in my posts, delivered straight to your inbox.
                    </p>
                </div>

                <div className="mt-12 bg-white/60 p-8 rounded-xl border border-[var(--border-primary)] backdrop-blur-sm shadow-[var(--shadow-custom-lg)]">
                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                            <FormInput id="name" name="name" type="text" label="Full Name" autoComplete="name" value={formData.name} onChange={handleInputChange} error={errors.name} />
                            <FormInput id="email" name="email" type="email" label="Email Address" autoComplete="email" value={formData.email} onChange={handleInputChange} error={errors.email} />
                        </div>
                        
                        <FormSelect id="resource" name="resource" label="Which resource would you like?" value={formData.resource} onChange={handleInputChange} error={errors.resource}>
                            <option value="" disabled>Select a resource...</option>
                            <option value="ai-work-around">AI Work Around</option>
                        </FormSelect>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-lg text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed disabled:scale-100"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </>
                                ) : 'Get Your Resources'}
                            </button>
                            {submitError && <p className="text-red-500 text-sm mt-4 text-center">{submitError}</p>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResourcesPage;
