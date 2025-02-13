
import { BookOpen, GraduationCap, Award } from 'lucide-react';

const Lessons = () => {
  const lessons = [
    {
      title: 'Introduction to Investing',
      description: 'Learn the basics of investing and how to get started.',
      duration: '45 mins',
      level: 'Beginner',
    },
    {
      title: 'Understanding ETFs',
      description: 'Explore the world of Exchange-Traded Funds.',
      duration: '30 mins',
      level: 'Intermediate',
    },
    {
      title: 'Stock Market Analysis',
      description: 'Master the art of analyzing stocks and market trends.',
      duration: '60 mins',
      level: 'Advanced',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Completed Lessons</p>
              <h3 className="text-2xl font-bold text-white mt-1">12/24</h3>
            </div>
            <BookOpen className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Current Level</p>
              <h3 className="text-2xl font-bold text-white mt-1">Intermediate</h3>
            </div>
            <GraduationCap className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Achievements</p>
              <h3 className="text-2xl font-bold text-white mt-1">5 Badges</h3>
            </div>
            <Award className="h-8 w-8 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Available Lessons */}
      <div className="bg-[#0A1929]/80 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Available Lessons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson, index) => (
            <div key={index} className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 p-6 rounded-lg">
              <BookOpen className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{lesson.title}</h3>
              <p className="text-blue-300 mb-4">{lesson.description}</p>
              <div className="flex justify-between text-sm">
                <span className="text-blue-200">{lesson.duration}</span>
                <span className="text-blue-200">{lesson.level}</span>
              </div>
              <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                Start Lesson
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Progress */}
      <div className="bg-[#0A1929]/80 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Your Learning Progress</h2>
        <div className="space-y-4">
          {['Basics', 'Investment', 'Advanced'].map((category, index) => (
            <div key={index} className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white">{category}</span>
                <span className="text-blue-300">{(75 - index * 25)}%</span>
              </div>
              <div className="w-full bg-blue-900/50 rounded-full h-2">
                <div
                  className="bg-blue-500 rounded-full h-2"
                  style={{ width: `${75 - index * 25}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lessons;
