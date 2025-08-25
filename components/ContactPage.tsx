import React, { useState, FormEvent, useEffect } from 'react';

// --- Static Data ---
const aiFacts = [
    "AI-powered chatbots now handle over 80% of routine customer service queries in some industries.",
    "Businesses using AI for predictive analytics see up to 20% higher sales conversions.",
    "AI is saving companies millions by automating repetitive back-office tasks.",
    "AI can analyze supply chain risks 24/7, preventing costly bottlenecks.",
    "AI enables hyper-personalized marketing, boosting engagement by up to 40%.",
    "AI prevents billions in fraud each year for banks and e-commerce platforms.",
    "AI can cut hiring time in half with smart resume screening.",
    "35% of Amazon's sales come from AI recommendation engines.",
    "AI-powered robots improve safety and efficiency in manufacturing plants.",
    "AI helps businesses track ESG and sustainability goals in real time.",
    "AI can process customer feedback at scale to improve product design.",
    "AI-driven energy optimization lowers utility costs for large facilities.",
    "Insurers now use AI to detect fraudulent claims in seconds.",
    "AI is powering dynamic video ads tailored to individual viewer interests.",
    "AI speech recognition improves call center productivity by over 30%.",
    "AI-backed forecasting reduces excess inventory and boosts profits.",
    "AI cybersecurity systems detect threats faster than humans ever could.",
    "Predictive AI maintenance saves airlines and factories millions in downtime.",
    "CFOs now rely on AI to provide real-time financial insights.",
    "AI-powered dynamic pricing helps airlines and hotels maximize revenue.",
    "70% of consumers prefer interacting with businesses using AI assistants for instant support.",
    "Creative teams use AI for idea generation, content drafts, and design suggestions.",
    "AI helps HR predict employee turnover before it happens.",
    "AI translation tools allow businesses to expand globally without language barriers.",
    "AI detects insider risks by spotting unusual digital behaviors.",
    "AI optimizes last-mile deliveries, cutting logistics costs by 10–15%.",
    "Energy companies use AI to predict demand and reduce waste.",
    "Investment firms use AI algorithms to make faster and smarter trading decisions.",
    "AI powers virtual try-ons, boosting e-commerce purchase confidence.",
    "AI is redefining business strategy by providing real-time scenario planning.",
];

const countries = [
  "United States", "United Kingdom", "Canada", "Australia", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

// --- Calendar Component ---
const Calendar: React.FC<{
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
    selectedTime: string | null;
    onTimeSelect: (time: string | null) => void;
    timeError?: string;
}> = ({ selectedDate, onDateSelect, selectedTime, onTimeSelect, timeError }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const addDays = (date: Date, days: number) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    };

    const weekDays = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(currentDate);
        const day = d.getDay();
        const diff = d.getDate() - day + i;
        return new Date(d.setDate(diff));
    });
    
    const availableTimes = [
        "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
        "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
    ];

    const handlePrevWeek = () => setCurrentDate(addDays(currentDate, -7));
    const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));
    
    const handleDateSelect = (date: Date) => {
        onDateSelect(date);
        onTimeSelect(null); // Reset time when date changes
    };

    return (
        <div className="bg-white/60 backdrop-blur-lg p-6 md:p-8 rounded-2xl border border-[var(--border-primary)] shadow-[var(--shadow-custom-lg)] w-full">
            {/* Header with navigation */}
            <div className="flex justify-between items-center mb-6">
                <button onClick={handlePrevWeek} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h3 className="text-lg font-semibold text-slate-800 text-center">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <button onClick={handleNextWeek} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Week days */}
            <div className="grid grid-cols-7 gap-1 text-center">
                {weekDays.map(day => (
                    <button 
                        key={day.toISOString()}
                        onClick={() => handleDateSelect(day)}
                        className={`p-1 sm:p-2 rounded-lg transition-colors group ${isSameDay(day, selectedDate) ? 'bg-indigo-600 text-white font-bold shadow-md' : 'hover:bg-slate-100'}`}
                    >
                        <div className={`text-xs font-medium ${isSameDay(day, selectedDate) ? 'text-indigo-100' : 'text-slate-500 group-hover:text-slate-700'}`}>{day.toLocaleDateString('default', { weekday: 'short' })}</div>
                        <div className={`mt-1 text-lg font-semibold ${isSameDay(day, selectedDate) ? 'text-white' : 'text-slate-800'}`}>{day.getDate()}</div>
                    </button>
                ))}
            </div>

            {/* Time slots */}
            <div className="mt-8 border-t border-slate-200 pt-6">
                 <h4 className="font-semibold text-slate-700 mb-4 text-center">Available Slots for {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}</h4>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pr-2">
                     {availableTimes.map(time => (
                         <button
                             key={time}
                             onClick={() => onTimeSelect(time)}
                             className={`p-3 w-full text-center text-sm font-semibold rounded-lg transition-all duration-200 border-2 ${selectedTime === time ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white/80 border-slate-200 text-indigo-700 hover:border-indigo-400 hover:bg-indigo-50'}`}
                         >
                             {time}
                         </button>
                     ))}
                 </div>
                 {timeError && <p className="text-red-500 text-xs mt-3 text-center">{timeError}</p>}
            </div>
        </div>
    );
};

// --- FormInput Component ---
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

// --- FormSelect Component ---
const FormSelect: React.FC<{
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
    children: React.ReactNode;
    autoComplete?: string;
    disabled?: boolean;
}> = ({ id, name, label, value, onChange, error, children, autoComplete, disabled = false }) => (
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
                autoComplete={autoComplete}
                disabled={disabled}
                className={`block w-full px-4 py-3 bg-white/80 border rounded-lg shadow-sm transition-shadow appearance-none
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                            ${error ? 'border-red-400' : 'border-slate-300'} ${!value ? 'text-slate-400' : 'text-slate-900'}
                            ${disabled ? 'bg-slate-50 cursor-not-allowed' : ''}`}
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

// --- FormTextarea Component ---
const FormTextarea: React.FC<{
    id: string;
    name: string;
    label: string;
    rows: number;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    error?: string;
}> = ({ id, name, label, rows, value, onChange, error }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
            {label}
        </label>
        <div className="mt-1">
            <textarea
                name={name}
                id={id}
                rows={rows}
                value={value}
                onChange={onChange}
                className={`block w-full px-4 py-3 bg-white/80 border rounded-lg shadow-sm placeholder-slate-400 transition-shadow resize-none
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                            ${error ? 'border-red-400' : 'border-slate-300'}`}
            />
        </div>
        {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
);

// --- ContactForm Component ---
interface FormData {
    name: string;
    email: string;
    industry: string;
    country: string;
    budget: string;
    outcome: string;
    message: string;
}

interface ContactFormProps {
    formData: FormData;
    errors: { [key: string]: string };
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onSubmit: (e: FormEvent) => void;
    isLoading: boolean;
    submitError: string | null;
}

const ContactForm: React.FC<ContactFormProps> = ({ formData, errors, onInputChange, onSubmit, isLoading, submitError }) => {
    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Schedule a Consultation</h2>
            <p className="mt-3 text-lg text-slate-600 mb-8">
                Find a time that works for you, and let's discuss how AI can revolutionize your business.
            </p>
            <form onSubmit={onSubmit} className="space-y-6" noValidate>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                    <FormInput id="name" name="name" type="text" label="Name" autoComplete="name" value={formData.name} onChange={onInputChange} error={errors.name} />
                    <FormInput id="email" name="email" type="email" label="Email Address" autoComplete="email" value={formData.email} onChange={onInputChange} error={errors.email} />
                    <FormInput id="industry" name="industry" type="text" label="Industry" autoComplete="organization-title" value={formData.industry} onChange={onInputChange} error={errors.industry} />
                    
                    <FormSelect id="country" name="country" label="Country" autoComplete="country-name" value={formData.country} onChange={onInputChange} error={errors.country}>
                        <option value="" disabled>Select a country...</option>
                        {countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </FormSelect>

                    <FormSelect id="budget" name="budget" label="How much are you willing to spend" value={formData.budget} onChange={onInputChange} error={errors.budget}>
                        <option value="" disabled>Select an amount...</option>
                        <option value="< $1000">&lt; $1,000</option>
                        <option value="$1000 - $2000">$1,000 - $2,000</option>
                        <option value="$2000 - $5000">$2,000 - $5,000</option>
                        <option value="$5000 - $10000">$5,000 - $10,000</option>
                        <option value="> $10000">&gt; $10,000</option>
                    </FormSelect>
                </div>

                <FormTextarea id="outcome" name="outcome" label="What kind of outcome do you want with AI?" rows={4} value={formData.outcome} onChange={onInputChange} error={errors.outcome} />
                <FormTextarea id="message" name="message" label="Message (optional)" rows={3} value={formData.message} onChange={onInputChange} error={errors.message} />

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
                                Booking...
                            </>
                        ) : 'Confirm Appointment'}
                    </button>
                    {submitError && <p className="text-red-500 text-sm mt-4 text-center">{submitError}</p>}
                </div>
            </form>
        </div>
    );
};

// --- Main Page Component ---
const ContactPage: React.FC = () => {
    const [formStatus, setFormStatus] = useState<'editing' | 'submitted'>('editing');
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        industry: '',
        country: '',
        budget: '',
        outcome: '',
        message: '',
    });
    
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    
    // State for the rotating "Did you know?" facts
    const [currentFactIndex, setCurrentFactIndex] = useState(() => Math.floor(Math.random() * aiFacts.length));

    // AUTO-DETECTION useEffect - SIMPLIFIED TO ONLY DETECT COUNTRY
    useEffect(() => {
        const detectCountry = async () => {
            try {
                // Get user's country from IP geolocation
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                
                if (data && data.country_name) {
                    const detectedCountry = data.country_name;
                    
                    // Check if the detected country exists in our countries list
                    const countryExists = countries.includes(detectedCountry);
                    
                    if (countryExists) {
                        // Update form data with detected country
                        setFormData(prev => ({
                            ...prev,
                            country: detectedCountry
                        }));
                    }
                }
            } catch (error) {
                console.log('Country auto-detection failed:', error);
                // Silently fail - user can manually select country
            }
        };
        
        detectCountry();
    }, []); // Empty dependency array means this runs once on component mount

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFactIndex(prevIndex => (prevIndex + 1) % aiFacts.length);
        }, 5000); // Change fact every 5 seconds

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    
    const handleTimeSelect = (time: string | null) => {
        setSelectedTime(time);
        if (errors.time) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.time;
                return newErrors;
            });
        }
    }
    
    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required.';
        if (!formData.email.trim()) {
            newErrors.email = 'Email Address is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please provide a valid email address.';
        }
        if (!formData.industry.trim()) newErrors.industry = 'Industry is required.';
        if (!formData.country) newErrors.country = 'Country is required.';
        if (!formData.budget) newErrors.budget = 'Please select a budget.';
        if (!formData.outcome.trim()) newErrors.outcome = 'Please describe your desired outcome.';
        if (!selectedTime) newErrors.time = 'Please select an available time slot.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      setSubmitError(null);
    
      if (validate()) {
        setIsLoading(true);
        try {
          // Get user's timezone automatically
          const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          
          const submissionData = {
            name: formData.name,
            email: formData.email,
            industry: formData.industry,
            country: formData.country,
            timezone: userTimezone, // Automatically detected timezone
            budget: formData.budget,
            outcome: formData.outcome,
            message: formData.message,
            appointmentDate: selectedDate.toISOString().split('T')[0],
            appointmentTime: selectedTime || '',
          };
    
          const proxyUrl = '/.netlify/functions/proxyWebhook';

          const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // use 'application/json'
            body: JSON.stringify(submissionData),
            });

    
          const resultText = await response.text();
          console.log("Webhook raw response:", response.status, resultText);
    
          if (!response.ok) {
            throw new Error(`Webhook submission failed with status: ${response.status}`);
          }
    
          // If it's JSON like {"message":"Workflow was started"}
          try {
            const result = JSON.parse(resultText);
            console.log("Webhook parsed response:", result);
          } catch {
            console.warn("Response was not JSON:", resultText);
          }
    
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
            <div key="contact-success" className="animate-fadeInUp pt-28 sm:pt-32 pb-16">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-white/60 backdrop-blur-lg p-8 md:p-12 rounded-2xl border border-[var(--border-primary)] shadow-[var(--shadow-custom-lg)]">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                             <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">Appointment Booked!</h2>
                        <p className="mt-4 text-lg text-slate-600">
                            Thank you for scheduling a consultation. I have received your request and will send a confirmation to <span className="font-semibold text-indigo-600">{formData.email}</span> shortly.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    
    const factWithoutPrefix = aiFacts[currentFactIndex].replace(/^Did you know /i, '');

    return (
        <div key="contact" className="animate-fadeInUp pt-28 sm:pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative">
                    <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
                        <div className="w-full md:w-1/2">
                            <Calendar 
                                selectedDate={selectedDate}
                                onDateSelect={setSelectedDate}
                                selectedTime={selectedTime}
                                onTimeSelect={handleTimeSelect}
                                timeError={errors.time}
                            />
                            <div className="mt-8 bg-indigo-50 border-l-4 border-indigo-300 p-5 rounded-r-lg shadow-[var(--shadow-custom)]">
                                <div className="flex items-start gap-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a7.5 7.5 0 01-7.5 0c-1.42 0-2.67-.34-3.75-.934m15.002 0c-1.08.594-2.33.934-3.75.934a7.5 7.5 0 01-7.5 0" />
                                    </svg>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-800">Did you know?</h4>
                                        <p className="mt-1 text-slate-600 transition-opacity duration-500">
                                            <span className="font-bold text-indigo-600">"</span>
                                            {factWithoutPrefix}
                                            <span className="font-bold text-indigo-600">"</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2">
                            <ContactForm 
                                formData={formData} 
                                errors={errors} 
                                onInputChange={handleInputChange} 
                                onSubmit={handleSubmit}
                                isLoading={isLoading}
                                submitError={submitError}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
