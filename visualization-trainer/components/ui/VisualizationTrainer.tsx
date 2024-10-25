"use client"; // Ensure the component runs on the client side

import React, { useState, useEffect } from 'react';
import { Timer, Clock, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Add image URLs - replace these with your actual image paths
const images = {
  image1: '/images/img1.png',
  image2: '/images/img2.gif',
  image3: '/images/img3.gif',
  image4: '/images/img4.gif',
  image5: '/images/img5.gif',
};

const VisualizationTrainer = () => {
  // State management
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTime, setSelectedTime] = useState(1);
  const [isTraining, setIsTraining] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentFocusStreak, setCurrentFocusStreak] = useState(0);
  const [bestFocusStreak, setBestFocusStreak] = useState(0);
  const [stats, setStats] = useState({
    image1: { practices: 0, totalMinutes: 0, highScore: 0 },
    image2: { practices: 0, totalMinutes: 0, highScore: 0 },
    image3: { practices: 0, totalMinutes: 0, highScore: 0 },
    image4: { practices: 0, totalMinutes: 0, highScore: 0 },
    image5: { practices: 0, totalMinutes: 0, highScore: 0 }
  });

  // Load stats from localStorage when the component mounts
  useEffect(() => {
    const savedStats = localStorage.getItem('visualizationStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('visualizationStats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    let interval;
    if (isTraining && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setCurrentFocusStreak(prev => prev + 1);
      }, 1000);
    } else if (timeLeft === 0 && isTraining) {
      endSession();
    }
    return () => clearInterval(interval);
  }, [isTraining, timeLeft]);

  const startTraining = () => {
    if (!selectedImage) return;
    setIsTraining(true);
    setTimeLeft(selectedTime * 60);
    setCurrentFocusStreak(0);
    setBestFocusStreak(0);
  };

  const endSession = () => {
    setIsTraining(false);
    if (selectedImage) {
      const imageKey = `image${selectedImage}`;
      setStats(prev => ({
        ...prev,
        [imageKey]: {
          practices: prev[imageKey].practices + 1,
          totalMinutes: prev[imageKey].totalMinutes + selectedTime,
          highScore: Math.max(prev[imageKey].highScore, bestFocusStreak)
        }
      }));
    }
  };

  const handleLostFocus = () => {
    setBestFocusStreak(prev => Math.max(prev, currentFocusStreak));
    setCurrentFocusStreak(0);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
      <Card className="max-w-2xl mx-auto bg-gray-800 text-gray-100 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl text-center text-blue-400">
            Visualization Trainer
          </CardTitle>
          {!isTraining && (
            <p className="text-center text-gray-400">
              To master the visualization, get 5 minutes of consistent focus
            </p>
          )}
        </CardHeader>
        <CardContent>
          {!isTraining ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">
                  Select Image:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Button
                      key={num}
                      variant={selectedImage === num ? "default" : "outline"}
                      onClick={() => setSelectedImage(num)}
                      className={`h-16 sm:h-20 p-1 ${selectedImage === num ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 hover:bg-gray-600 border-gray-600"}`}
                    >
                      <div className="flex flex-col items-center justify-center w-full h-full space-y-1">
                        <img
                          src={images[`image${num}`]}
                          alt={`Image ${num}`}
                          className="w-10 h-10 object-cover" // Adjust the size of the image
                        />
                        <span className="text-xs sm:text-sm whitespace-nowrap">Image {num}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">
                  Select Time (minutes):
                </label>
                <Select
                  value={selectedTime.toString()}
                  onValueChange={(value) => setSelectedTime(parseInt(value))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()} className="text-gray-100 focus:bg-gray-600">
                        {num} minutes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedImage && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-blue-400">
                    Image {selectedImage} Stats:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
                      <Clock className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                      <p className="text-sm text-gray-400">Practices</p>
                      <p className="font-bold">{stats[`image${selectedImage}`].practices}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
                      <Timer className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                      <p className="text-sm text-gray-400">Total Minutes</p>
                      <p className="font-bold">{stats[`image${selectedImage}`].totalMinutes}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-700 rounded-lg border border-gray-600">
                      <Trophy className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                      <p className="text-sm text-gray-400">Best Focus</p>
                      <p className="font-bold">{stats[`image${selectedImage}`].highScore}s</p>
                    </div>
                  </div>
                </div>
              )}
              <Button
                onClick={startTraining}
                disabled={!selectedImage}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Start Training
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl mb-2">Image {selectedImage}</h2>
                {selectedImage && (
                  <div className="mb-4 relative h-48 sm:h-64 bg-gray-700 rounded-lg overflow-hidden">
                    <img
                      src={images[`image${selectedImage}`]}
                      alt={`Visualization ${selectedImage}`}
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-1000"
                    style={{ width: `${((selectedTime * 60 - timeLeft) / (selectedTime * 60)) * 100}%` }}
                  />
                </div>
                <p className="mt-2 text-xl font-bold">{formatTime(timeLeft)}</p>
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Current Focus Streak</p>
                  <p className="text-2xl font-bold text-blue-400">{currentFocusStreak}s</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Best Focus Streak This Session</p>
                  <p className="text-2xl font-bold text-blue-400">{bestFocusStreak}s</p>
                </div>
              </div>
              <div className="space-y-4">
                <Button
                  onClick={handleLostFocus}
                  variant="outline"
                  className="w-full bg-white text-black border-gray-600 hover:bg-gray-200"
                >
                  I Lost Focus
                </Button>
                <Button
                  onClick={endSession}
                  variant="destructive"
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  End Session
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VisualizationTrainer;
