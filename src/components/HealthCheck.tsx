
import { useEffect, useState } from 'react';
import { Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import axios from 'axios';

const HealthCheck = () => {
  const [profileData, setProfileData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setProfileData(userDoc.data());
          await getRecommendations(userDoc.data());
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

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
    }
  };

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
