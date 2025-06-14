import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { MapPin, Camera, Calendar, MessageSquare, Loader2, Check } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import MapView, { PotholeMarker } from '../components/MapView';
///

const MOCK_MARKERS: PotholeMarker[] = [
    { id: '1', position: [19.076, 72.8777], severity: 'high', reportDate: '2023-08-15', status: 'verified', bounty: 2500 },
    { id: '2', position: [28.7041, 77.1025], severity: 'medium', reportDate: '2023-08-20', status: 'in_progress', bounty: 1500 },
    { id: '3', position: [12.9716, 77.5946], severity: 'low', reportDate: '2023-08-25', status: 'reported', bounty: 800 },
];

type SubmissionStep = 'photo' | 'location' | 'details' | 'submitting' | 'success';

const ReportPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<SubmissionStep>('photo');
    const [potholeImage, setPotholeImage] = useState<File | null>(null);
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    // New state for backend data
    const [severity, setSeverity] = useState<string | null>(null);
    const [estimatedSize, setEstimatedSize] = useState<string | null>(null);
    const [bounty, setBounty] = useState<number | null>(null);
    const [trafficFlow, setTrafficFlow] = useState<string | null>(null);
    const [potholes, setPotholes] = useState<string | null>(null);

    const handleImageChange = (file: File | null) => setPotholeImage(file);

    useEffect(() => {
        const submitReport = async () => {
            if (currentStep !== 'submitting') return;

            try {
                const formData = new FormData();
                formData.append("location", location);
                formData.append("latitude", coordinates?.[0]?.toString() ?? '');
                formData.append("longitude", coordinates?.[1]?.toString() ?? '');
                if (potholeImage) {
                    formData.append("image", potholeImage);
                }
                formData.append("description", description);

                const response = await fetch("http://localhost:8080/api/post-report", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Server returned:", data);

                // Update states with backend data
                setSeverity(data.severity ?? 'IDK');
                setEstimatedSize(data.size ?? 'Check');
                setBounty(data.bounty ?? 6969);
                setTrafficFlow(data.trafficFlow ?? 'Unknown');
                setPotholes(data.potholes ?? 'X amount')
                setTimeout(() => {
                    setCurrentStep('success');
                }, 2500);
            } catch (err) {
                console.error("Error submitting pothole report:", err);
                alert("Failed to submit report. Please try again.");
                setCurrentStep('details');
            }
        };

        submitReport();
    }, [currentStep]);

    const detectLocation = async () => {
        setIsGettingLocation(true);
        if (!navigator.geolocation) {
            console.error('Geolocation not supported by this browser');
            setIsGettingLocation(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async position => {
                const { latitude, longitude } = position.coords;
                setCoordinates([latitude, longitude]);
                try {
                    const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                    if (!resp.ok) throw new Error('Reverse geocode failed');
                    const data = await resp.json();
                    setLocation(data.display_name);
                } catch (err) {
                    console.error('Error reverse-geocoding location:', err);
                    setLocation(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
                } finally {
                    setIsGettingLocation(false);
                }
            },
            error => {
                console.error('Error getting geolocation:', error);
                setIsGettingLocation(false);
            }
        );
    };

    const nextStep = () => {
        if (currentStep === 'photo' && potholeImage) setCurrentStep('location');
        else if (currentStep === 'location' && location && coordinates) setCurrentStep('details');
        else if (currentStep === 'details') setCurrentStep('submitting');
        else if (currentStep === 'success') navigate('/dashboard');
    };

    const previousStep = () => {
        if (currentStep === 'location') setCurrentStep('photo');
        else if (currentStep === 'details') setCurrentStep('location');
    };

    const renderStepContent = () => {
        switch (currentStep) {
      case 'photo':
        return (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Upload Pothole Photo</h2>
              <div className="mb-6">
                <ImageUpload onChange={handleImageChange} />
              </div>
              <p className="text-sm text-neutral-500 mb-6">
                Please take a clear photo of the pothole. This helps our AI accurately assess the damage.
              </p>
              <div className="flex justify-end">
                <button className="btn btn-primary" onClick={nextStep} disabled={!potholeImage}>
                  Next
                </button>
              </div>
            </div>
        );
      case 'location':
        return (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Pothole Location</h2>
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Address
                </label>
                <div className="flex">
                  <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="Street address of pothole"
                      className="input flex-1"
                  />
                  <button
                      type="button"
                      className="ml-2 px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center justify-center"
                      onClick={detectLocation}
                      disabled={isGettingLocation}
                  >
                    {isGettingLocation ? <Loader2 size={20} className="animate-spin" /> : <MapPin size={20} />}
                  </button>
                </div>
              </div>
               <div className="mb-6 h-60">
                {coordinates ? (
                    <MapView
                        markers={[
                          ...MOCK_MARKERS,
                          { id: 'new', position: coordinates, severity: 'medium', reportDate: new Date().toISOString().split('T')[0], status: 'reported', bounty: 0 },
                        ]}
                        center={coordinates}
                        zoom={15}
                    />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 text-center">
                        <MapPin size={48} className="mb-4 text-neutral-400" />
                        <p className="text-neutral-500">Use the location button to detect your position</p>
                    </div>
                )
                }
              </div>
              <div className="flex justify-between">
                <button className="btn btn-outline" onClick={previousStep}>
                  Previous
                </button>
                <button className="btn btn-primary" onClick={nextStep} disabled={!location || !coordinates}>
                  Next
                </button>
              </div>
            </div>
        );
      case 'details':
        return (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Additional Details</h2>
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Provide a Description to Help Fix the Issue More Accurately (Optional
                </label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Provide any additional details about the pothole..."
                    className="input min-h-[120px]"
                />
              </div>
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 mb-6">
                <h3 className="text-lg font-semibold mb-4">Report Summary</h3>
                <div className="space-y-3">
                  <div className="flex">
                    <Camera size={18} className="mr-2 text-neutral-500" />
                    <span className="text-neutral-700 dark:text-neutral-300">Photo uploaded</span>
                  </div>
                  <div className="flex">
                    <MapPin size={18} className="mr-2 text-neutral-500" />
                    <span className="text-neutral-700 dark:text-neutral-300">{location}</span>
                  </div>
                  <div className="flex">
                    <Calendar size={18} className="mr-2 text-neutral-500" />
                    <span className="text-neutral-700 dark:text-neutral-300">{new Date().toLocaleDateString()}</span>
                  </div>
                  {description && (
                      <div className="flex">
                        <MessageSquare size={18} className="mr-2 text-neutral-500" />
                        <span className="text-neutral-700 dark:text-neutral-300">{description}</span>
                      </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <button className="btn btn-outline" onClick={previousStep}>
                  Previous
                </button>
                <button className="btn btn-primary" onClick={nextStep}>
                  Submit Report
                </button>
              </div>
            </div>
        );
            case 'submitting':
                return (
                    <div className="animate-fade-in py-10 text-center">
                        <Loader2 size={48} className="animate-spin mx-auto mb-6 text-primary-500" />
                        <h2 className="text-2xl font-bold mb-2">Processing Your Report</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            Our AI is analyzing the pothole image and calculating severity...
                        </p>
                        <div className="w-full max-w-md mx-auto bg-neutral-100 dark:bg-neutral-800 rounded-full h-2.5">
                            <div className="bg-primary-500 h-2.5 rounded-full animate-pulse" style={{ width: '60%' }} />
                        </div>
                    </div>
                );
            case 'success':
                return (
                    <div className="animate-fade-in py-10 text-center">
                        <div
                            className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-6">
                            <Check size={32} className="text-success-600"/>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Report Submitted Successfully!</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            Thank you for helping improve our roads. Our AI has analyzed the pothole.
                        </p>
                        <div className="card max-w-md mx-auto p-4 mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-neutral-600 dark:text-neutral-400 font-semibold">Severity:</span>
                                <span
                                    className={`badge text-white flex items-center justify-center`}
                                    style={{
                                        borderRadius: '10068px',
                                        padding: '0.5rem 1.5rem',  // equal top/bottom padding for vertical centering
                                        fontSize: '0.9rem',
                                        lineHeight: '1rem',
                                        fontWeight: 600,
                                        backgroundColor:
                                            severity === 'High' ? '#ef4444' :
                                                severity === 'Medium' ? '#facc15' :
                                                    severity === 'Low' ? '#22c55e' :
                                                        '#9ca3af',
                                        minWidth: '4.5rem',
                                        textAlign: 'center',
                                    }}
                                >
                            {severity ?? 'N/A'}
                            </span>
                            </div>

                            <div className="flex justify-between mb-4">
                                <span className="text-neutral-600 dark:text-neutral-400">• No of Potholes:</span>
                                <span className="font-semibold">{potholes ?? 'X'}</span>
                            </div>

                            <div className="flex justify-between mb-4">
                                <span className="text-neutral-600 dark:text-neutral-400">• Estimated size:</span>
                                <span className="font-semibold">{estimatedSize ?? 'N/A'}</span>
                            </div>

                            <div className="flex justify-between mb-4">
                                <span className="text-neutral-600 dark:text-neutral-400">• Traffic flow:</span>
                                <span className="font-semibold">{trafficFlow ?? 'N/A'}</span>
                            </div>

                            <div className="flex justify-between mb-4">
                                <span className="text-neutral-600 dark:text-neutral-400"><b>Bounty assigned:</b></span>
                                <span className="font-semibold text-accent-600">₹{bounty ?? 'N/A'}</span>
                            </div>

                        </div>
                        <Link to="//localhost:5173/">
                        <button className="btn btn-primary" onClick={nextStep}>
                            View Dashboard
                        </button>
                        </Link>
                    </div>
                );
            default:
                return null;
        }
    };


    return (
        <div className="bg-neutral-50 dark:bg-neutral-900 min-h-screen pb-12">
            <div className="bg-primary-600 text-white py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold">Report a Pothole</h1>
                    <p className="text-primary-100">Help make our roads safer by reporting potholes in your area</p>
                </div>
            </div>
            <div className="container mx-auto px-4 pt-8">

                <div
                    className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl p-12 max-w-4xl mx-auto mt-5 border border-gray-200 dark:border-neutral-700"
                    style={{
                        backdropFilter: 'saturate(180%) blur(12px)',
                    }}
                >
                    {/* Progress Indicators */}
                    {currentStep !== 'submitting' && currentStep !== 'success' && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between">
                                <div
                                    className={`flex flex-col items-center ${currentStep === 'photo' ? 'text-primary-500' : 'text-neutral-500'}`}>
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${currentStep === 'photo' ? 'bg-primary-500 text-white' : currentStep === 'location' || currentStep === 'details' ? 'bg-success-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'}`}>
                                        {currentStep === 'location' || currentStep === 'details' ?
                                            <Check size={16}/> : 1}
                                    </div>
                                    <span className="text-xs font-medium">Photo</span>
                                </div>
                                <div
                                    className={`flex-grow border-t border-neutral-300 dark:border-neutral-700 mx-2`}></div>
                                <div
                                    className={`flex flex-col items-center ${currentStep === 'location' ? 'text-primary-500' : currentStep === 'photo' ? 'text-neutral-500' : 'text-success-500'}`}>
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${currentStep === 'location' ? 'bg-primary-500 text-white' : currentStep === 'details' ? 'bg-success-500 text-white' : currentStep === 'photo' ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'}`}>
                                        {currentStep === 'details' ? <Check size={16}/> : 2}
                                    </div>
                                    <span className="text-xs font-medium">Location</span>
                                </div>
                                <div
                                    className={`flex-grow border-t border-neutral-300 dark:border-neutral-700 mx-2`}></div>
                                <div
                                    className={`flex flex-col items-center ${currentStep === 'details' ? 'text-primary-500' : 'text-neutral-500'}`}>
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${currentStep === 'details' ? 'bg-primary-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'}`}>
                                        3
                                    </div>
                                    <span className="text-xs font-medium">Details</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {renderStepContent()}
                </div>
            </div>
        </div>
    );
};

export default ReportPage;