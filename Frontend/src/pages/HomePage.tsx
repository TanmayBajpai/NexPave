import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, MapPin, Award, CheckCircle2 } from 'lucide-react';
import roadimage from '../assets/road.png';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-700 to-primary-800 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <img
            src={roadimage}
            alt="Road"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              Fix Our Roads, <span className="text-accent-400">Together</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-neutral-100 animate-slide-in">
              NexPave transforms everyday commuters into guardians of the street. Report potholes, earn rewards, and help make our roads safer for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-in" style={{animationDelay: '0.2s'}}>
              <Link to="/report" className="btn bg-accent-500 hover:bg-accent-600 text-white shadow-lg">
                Report a Pothole
              </Link>
              <Link to="http://localhost:5173/contractor" className="btn bg-white text-primary-700 hover:bg-neutral-100">
                Contractor Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white dark:bg-neutral-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              NexPave creates a community-driven approach to road maintenance, empowering citizens and contractors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-6 flex flex-col items-center text-center hover:shadow-lg">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
                <Camera className="text-primary-600 dark:text-primary-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Report</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Use your phone to snap a photo of a pothole and submit its location. Our AI will assess the damage severity.
              </p>
            </div>
            
            <div className="card p-6 flex flex-col items-center text-center hover:shadow-lg">
              <div className="w-16 h-16 rounded-full bg-accent-100 dark:bg-accent-900 flex items-center justify-center mb-4">
                <MapPin className="text-accent-600 dark:text-accent-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verify</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Our machine learning model verifies the pothole, categorizes its severity, and assigns a bounty reward.
              </p>
            </div>
            
            <div className="card p-6 flex flex-col items-center text-center hover:shadow-lg">
              <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mb-4">
                <Award className="text-teal-600 dark:text-teal-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Claim</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Licensed contractors view open tasks, claim the ones they want to fix, and perform the necessary repairs.
              </p>
            </div>
            
            <div className="card p-6 flex flex-col items-center text-center hover:shadow-lg">
              <div className="w-16 h-16 rounded-full bg-success-100 dark:bg-success-900 flex items-center justify-center mb-4">
                <CheckCircle2 className="text-success-600 dark:text-success-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reward</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                After repair verification, secure digital payments are instantly released to contractors from the escrow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-neutral-100 dark:bg-neutral-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-6 hover:shadow-lg">
              <p className="text-4xl font-bold text-primary-500">2,543</p>
              <p className="text-neutral-600 dark:text-neutral-400">Potholes Reported</p>
            </div>
            <div className="card p-6 hover:shadow-lg">
              <p className="text-4xl font-bold text-accent-500">1,872</p>
              <p className="text-neutral-600 dark:text-neutral-400">Repairs Completed</p>
            </div>
            <div className="card p-6 hover:shadow-lg">
              <p className="text-4xl font-bold text-teal-500">₹925K</p>
              <p className="text-neutral-600 dark:text-neutral-400">Bounties Awarded</p>
            </div>
            <div className="card p-6 hover:shadow-lg">
              <p className="text-4xl font-bold text-success-500">358</p>
              <p className="text-neutral-600 dark:text-neutral-400">Active Contractors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-accent-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Be Part of the Solution</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of citizens and contractors working together to make our roads safer for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/report" className="btn bg-white text-accent-600 hover:bg-neutral-100">
              Report a Pothole
            </Link>
            <Link to="/contractor" className="btn bg-primary-600 hover:bg-primary-700 text-white">
              Become a Contractor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;