import React, { useState, FormEvent, useEffect } from 'react';

/* ── Static data ─────────────────────────────────────────── */
const aiFacts = [
  'AI-powered chatbots now handle over 80% of routine customer service queries in some industries.',
  'Businesses using AI for predictive analytics see up to 20% higher sales conversions.',
  'AI is saving companies millions by automating repetitive back-office tasks.',
  'AI can analyze supply chain risks 24/7, preventing costly bottlenecks.',
  'AI enables hyper-personalized marketing, boosting engagement by up to 40%.',
  'AI prevents billions in fraud each year for banks and e-commerce platforms.',
  'AI can cut hiring time in half with smart resume screening.',
  '35% of Amazon’s sales come from AI recommendation engines.',
  'AI-powered robots improve safety and efficiency in manufacturing plants.',
  'AI helps businesses track ESG and sustainability goals in real time.',
  'AI can process customer feedback at scale to improve product design.',
  'AI-driven energy optimization lowers utility costs for large facilities.',
  'Insurers now use AI to detect fraudulent claims in seconds.',
  'AI is powering dynamic video ads tailored to individual viewer interests.',
  'AI speech recognition improves call-center productivity by over 30%.',
  'AI-backed forecasting reduces excess inventory and boosts profits.',
  'AI cybersecurity systems detect threats faster than humans ever could.',
  'Predictive AI maintenance saves airlines and factories millions in downtime.',
  'CFOs now rely on AI to provide real-time financial insights.',
  'AI-powered dynamic pricing helps airlines and hotels maximize revenue.',
  '70% of consumers prefer interacting with businesses using AI assistants for instant support.',
  'Creative teams use AI for idea generation, content drafts and design suggestions.',
  'AI helps HR predict employee turnover before it happens.',
  'AI translation tools allow businesses to expand globally without language barriers.',
  'AI detects insider risks by spotting unusual digital behaviors.',
  'AI optimizes last-mile deliveries, cutting logistics costs by 10–15%.',
  'Energy companies use AI to predict demand and reduce waste.',
  'Investment firms use AI algorithms to make faster and smarter trading decisions.',
  'AI powers virtual try-ons, boosting e-commerce purchase confidence.',
  'AI is redefining business strategy by providing real-time scenario planning.',
];

/* ── Country / time-zone data (truncated for brevity) ─────── */
import { countries, countryTimezones } from './countryData'; // ← keep your long arrays in a helper file to stay tidy

/* ── Calendar ─────────────────────────────────────────────── */
const Calendar: React.FC<{
  selectedDate: Date;
  onDateSelect: (d: Date) => void;
  selectedTime: string | null;
  onTimeSelect: (t: string | null) => void;
  timeError?: string;
}> = ({ selectedDate, onDateSelect, selectedTime, onTimeSelect, timeError }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86_400_000);
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const base = new Date(currentDate);
    const diff = base.getDate() - base.getDay() + i;
    return new Date(base.setDate(diff));
  });

  const availableTimes = [
    '09:00 AM','10:00 AM','11:00 AM','12:00 PM',
    '01:00 PM','02:00 PM','03:00 PM','04:00 PM',
  ];

  return (
    <div className="bg-white/60 backdrop-blur-lg p-6 md:p-8 rounded-2xl border border-[var(--border-primary)] shadow-[var(--shadow-custom-lg)] w-full">
      {/* header – month switch */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setCurrentDate(addDays(currentDate, -7))} className="p-2 rounded-full hover:bg-slate-100">
          <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h3 className="text-lg font-semibold text-slate-800">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>

        <button onClick={() => setCurrentDate(addDays(currentDate, 7))} className="p-2 rounded-full hover:bg-slate-100">
          <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* days */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDays.map(day => (
          <button
            key={day.toISOString()}
            onClick={() => {
              onDateSelect(day);
              onTimeSelect(null);
            }}
            className={`p-2 rounded-lg transition-colors group
              ${isSameDay(day, selectedDate)
                ? 'bg-indigo-600 text-white font-bold shadow-md'
                : 'hover:bg-slate-100'}`}
          >
            <div className={`text-xs ${isSameDay(day, selectedDate) ? 'text-indigo-100' : 'text-slate-500 group-hover:text-slate-700'}`}>
              {day.toLocaleDateString('default', { weekday: 'short' })}
            </div>
            <div className={`mt-1 text-lg font-semibold ${isSameDay(day, selectedDate) ? 'text-white' : 'text-slate-800'}`}>
              {day.getDate()}
            </div>
          </button>
        ))}
      </div>

      {/* times */}
      <div className="mt-8 border-t border-slate-200 pt-6">
        <h4 className="font-semibold text-slate-700 mb-4 text-center">
          Available Slots for {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pr-2">
          {availableTimes.map(time => (
            <button
              key={time}
              onClick={() => onTimeSelect(time)}
              className={`p-3 w-full text-sm font-semibold rounded-lg border-2 transition-all
                ${selectedTime === time
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg'
                  : 'bg-white/80 border-slate-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400'}`}
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

/* ── Re-usable inputs/selects/textarea (same as before) ───── */
const FormInput: React.FC<{
  id: string; name: string; type: string; label: string;
  autoComplete?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}> = ({ id, name, type, label, autoComplete, value, onChange, error }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <div className="mt-1">
      <input
        id={id} name={name} type={type} autoComplete={autoComplete}
        value={value} onChange={onChange}
        className={`block w-full px-4 py-3 bg-white/80 border rounded-lg shadow-sm
          placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500
          ${error ? 'border-red-400' : 'border-slate-300'}`}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
  </div>
);

const FormSelect: React.FC<{
  id: string; name: string; label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string; children: React.ReactNode;
  autoComplete?: string; disabled?: boolean;
}> = ({ id, name, label, value, onChange, error, children, autoComplete, disabled = false }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <div className="mt-1 relative">
      <select
        id={id} name={name} value={value} onChange={onChange}
        autoComplete={autoComplete} disabled={disabled}
        className={`block w-full px-4 py-3 bg-white/80 border rounded-lg shadow-sm appearance-none
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          ${error ? 'border-red-400' : 'border-slate-300'}
          ${!value ? 'text-slate-400' : 'text-slate-900'}
          ${disabled ? 'bg-slate-50 cursor-not-allowed' : ''}`}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
    {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
  </div>
);

const FormTextarea: React.FC<{
  id: string; name: string; label: string; rows: number;
  value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
}> = ({ id, name, label, rows, value, onChange, error }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <div className="mt-1">
      <textarea
        id={id} name={name} rows={rows} value={value} onChange={onChange}
        className={`block w-full px-4 py-3 bg-white/80 border rounded-lg shadow-sm resize-none
          placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500
          ${error ? 'border-red-400' : 'border-slate-300'}`}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
  </div>
);

/* ── ContactForm (unchanged functionality) ───────────────── */
interface FormData {
  name: string; email: string; industry: string;
  country: string; timezone: string; budget: string;
  outcome: string; message: string;
}

interface ContactFormProps {
  formData: FormData;
  errors: { [k: string]: string };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
  submitError: string | null;
  availableTimezones: string[];
}

const ContactForm: React.FC<ContactFormProps> = ({
  formData, errors, onInputChange, onSubmit,
  isLoading, submitError, availableTimezones,
}) => {
  const tzDisabled = !formData.country || availableTimezones.length === 0;

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Schedule a Consultation</h2>
      <p className="mt-3 text-lg text-slate-600 mb-8">
        Find a time that works for you, and let’s discuss how AI can revolutionize your business.
      </p>

      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
          <FormInput id="name"    name="name"    type="text"  label="Name"          autoComplete="name"
            value={formData.name}    onChange={onInputChange} error={errors.name} />
          <FormInput id="email"   name="email"   type="email" label="Email Address" autoComplete="email"
            value={formData.email}   onChange={onInputChange} error={errors.email} />
          <FormInput id="industry" name="industry" type="text" label="Industry" autoComplete="organization-title"
            value={formData.industry} onChange={onInputChange} error={errors.industry} />

          <FormSelect id="country" name="country" label="Country" autoComplete="country-name"
            value={formData.country} onChange={onInputChange} error={errors.country}>
            <option value="" disabled>Select a country...</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </FormSelect>

          <FormSelect id="timezone" name="timezone" label="Time Zone" autoComplete="on" disabled={tzDisabled}
            value={formData.timezone} onChange={onInputChange} error={errors.timezone}>
            <option value="" disabled>{formData.country ? 'Select a time zone...' : 'Select a country first'}</option>
            {availableTimezones.map(t => <option key={t} value={t}>{t}</option>)}
          </FormSelect>

          <FormSelect id="budget" name="budget" label="How much are you willing to spend?"
            value={formData.budget} onChange={onInputChange} error={errors.budget}>
            <option value="" disabled>Select an amount...</option>
            <option value="< $1000">&lt; $1 000</option>
            <option value="$1000 - $2000">$1 000 – $2 000</option>
            <option value="$2000 - $5000">$2 000 – $5 000</option>
            <option value="$5000 - $10000">$5 000 – $10 000</option>
            <option value="> $10000">&gt; $10 000</option>
          </FormSelect>
        </div>

        <FormTextarea id="outcome" name="outcome" label="What kind of outcome do you want with AI?"
          rows={4} value={formData.outcome} onChange={onInputChange} error={errors.outcome} />

        <FormTextarea id="message" name="message" label="Message (optional)"
          rows={3} value={formData.message} onChange={onInputChange} error={errors.message} />

        <div>
          <button
            type="submit" disabled={isLoading}
            className="w-full flex items-center justify-center py-3.5 px-4 rounded-lg shadow-lg text-base font-medium
              text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:brightness-110
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              transition-all duration-300 transform hover:scale-105 disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4zm2 5.3A8 8 0 014 12H0c0 3 1.1 5.8 3 7.9l3-2.6z" />
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

/* ── Main page component ─────────────────────────────────── */
const ContactPage: React.FC = () => {
  const [formStatus, setFormStatus] = useState<'editing' | 'submitted'>('editing');
  const [isLoading, setIsLoading]   = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', industry: '', country: '', timezone: '',
    budget: '', outcome: '', message: '',
  });

  const [availableTimezones, setAvailableTimezones] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  /* rotating “Did you know?” fact */
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * aiFacts.length));
  useEffect(() => {
    const id = setInterval(() => setFactIndex(i => (i + 1) % aiFacts.length), 5_000);
    return () => clearInterval(id);
  }, []);

  /* update time-zones when country changes */
  useEffect(() => {
    const zones = countryTimezones[formData.country] || [];
    setAvailableTimezones(zones);
    setFormData(prev => ({ ...prev, timezone: '' })); // reset chosen tz
  }, [formData.country]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => { const n = { ...p }; delete n[name]; return n; });
  };

  const handleTimeSelect = (t: string | null) => {
    setSelectedTime(t);
    if (errors.time) setErrors(p => { const n = { ...p }; delete n.time; return n; });
  };

  const validate = () => {
    const n: { [k: string]: string } = {};
    if (!formData.name.trim())      n.name      = 'Name is required.';
    if (!formData.email.trim())     n.email     = 'Email Address is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) n.email = 'Please provide a valid email address.';
    if (!formData.industry.trim())  n.industry  = 'Industry is required.';
    if (!formData.country)          n.country   = 'Country is required.';
    if (!formData.timezone)         n.timezone  = 'Time zone is required.';
    if (!formData.budget)           n.budget    = 'Please select a budget.';
    if (!formData.outcome.trim())   n.outcome   = 'Please describe your desired outcome.';
    if (!selectedTime)              n.time      = 'Please select an available time slot.';
    setErrors(n);
    return Object.keys(n).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        appointmentDate: selectedDate.toISOString().split('T')[0],
        appointmentTime: selectedTime || '',
      };

      const response = await fetch('/.netlify/functions/proxyWebhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      console.log('Webhook response:', response.status, text);

      if (!response.ok) throw new Error(`Webhook failed: ${response.status}`);

      setFormStatus('submitted');
      window.scrollTo(0, 0);
    } catch (err: any) {
      console.error('Submission error', err);
      setSubmitError(err.message || 'Submission failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (formStatus === 'submitted') {
    return (
      <div className="animate-fadeInUp pt-28 sm:pt-32 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/60 backdrop-blur-lg p-8 md:p-12 rounded-2xl border border-[var(--border-primary)] shadow-[var(--shadow-custom-lg)]">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">Appointment Booked!</h2>
            <p className="mt-4 text-lg text-slate-600">
              Thank you for scheduling a consultation. A confirmation will be sent to&nbsp;
              <span className="font-semibold text-indigo-600">{formData.email}</span> shortly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* page in editing mode */
  const fact = aiFacts[factIndex].replace(/^Did you know /i, '');

  return (
    <div className="animate-fadeInUp pt-28 sm:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
            {/* calendar + fact */}
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
                  <svg className="h-8 w-8 text-indigo-400 flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 18v-5.25m0 0a6 6 0 001.5-.19m-1.5.19a6 6 0 01-1.5-.19m3.75 7.48a12 12 0 01-4.5 0m3.75 2.31a7.5 7.5 0 01-7.5 0c-1.42 0-2.67-.34-3.75-.93m15 0c-1.08.59-2.33.93-3.75.93a7.5 7.5 0 01-7.5 0" />
                  </svg>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">Did you know?</h4>
                    <p className="mt-1 text-slate-600">
                      <span className="font-bold text-indigo-600">“</span>
                      {fact}
                      <span className="font-bold text-indigo-600">”</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* form */}
            <div className="w-full md:w-1/2">
              <ContactForm
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                submitError={submitError}
                availableTimezones={availableTimezones}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
