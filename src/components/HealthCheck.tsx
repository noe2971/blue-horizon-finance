
import { useEffect, useState } from 'react';
import { Shield, TrendingUp, AlertTriangle, WifiOff } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

const HealthCheck = () => {
  const [profileData, setProfileData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!isOnline) {
        setLoading(false);
        toast({
          title: "Network Error",
          description: "You are currently offline. Please check your internet connection.",
          variant: "destructive",
        });
        return;
      }

      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            setProfileData(userDoc.data());
            await getRecommendations(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          toast({
            title: "Error",
            description: "Failed to fetch your financial data. Please try again later.",
            variant: "destructive",
          });
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [isOnline]);

  const getRecommendations = async (profile) => {
    const apiKey = import.meta.env.VITE_GPT_KEY;
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'user',
              content: `Based on this financial profile, provide 3 specific recommendations for improving financial health: ${JSON.stringify(profile)}. Format as JSON array with 'title' and 'description' fields.`
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const content = response.data.choices[0].message.content;
      setRecommendations(JSON.parse(content));
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to get AI recommendations. Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (!isOnline) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col items-center justify-center py-12">
            <WifiOff className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">You're Offline</h2>
            <p className="text-gray-500">Please check your internet connection and try again</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Financial Health Check</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <Shield className="h-8 w-8 text-blue-500 mb-2" />
            <h3 className="text-lg font-semibold text-blue-900">Risk Profile</h3>
            <p className="text-blue-600">{profileData?.riskProfile || 'Not assessed'}</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg">
            <TrendingUp className="h-8 w-8 text-blue-500 mb-2" />
            <h3 className="text-lg font-semibold text-blue-900">Investment Health</h3>
            <p className="text-blue-600">{profileData?.investmentHealth || 'Not assessed'}</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg">
            <AlertTriangle className="h-8 w-8 text-blue-500 mb-2" />
            <h3 className="text-lg font-semibold text-blue-900">Areas of Concern</h3>
            <p className="text-blue-600">{profileData?.concerns || 'None identified'}</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-blue-900 mb-4">AI Recommendations</h3>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="bg-blue-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">{rec.title}</h4>
              <p className="text-blue-600">{rec.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthCheck;
