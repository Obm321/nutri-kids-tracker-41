import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Apple, Carrot } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface WorldData {
  name: string;
  description: string;
  iconName: string;
  powerName: string;
  powerIconName: string;
  facts: string[];
}

const worldsData: WorldData[] = [
  {
    name: 'Fruit Forest',
    description: 'Collect fruit powers to become a fruit ninja!',
    iconName: 'Apple',
    powerName: 'Fruit',
    powerIconName: 'Apple',
    facts: [
      'Apples float in water because 25% of their volume is air',
      'Bananas are berries, but strawberries aren\'t',
      'Pineapples take about 18-20 months to grow',
      'A strawberry has about 200 seeds on its surface',
      'Oranges were historically a luxury item and a symbol of wealth'
    ]
  },
  {
    name: 'Veggie Valley',
    description: 'Harvest vegetable powers to grow strong!',
    iconName: 'Carrot',
    powerName: 'Veggie',
    powerIconName: 'Carrot',
    facts: [
      'Carrots were originally purple, not orange',
      'Potatoes were the first vegetable grown in space',
      'Cucumbers are 96% water',
      'Tomatoes are technically fruits, not vegetables',
      'Bell peppers have more vitamin C than oranges'
    ]
  }
];

const FoodQuest = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [heroLevel, setHeroLevel] = useState(1);
  const [powerLevel, setPowerLevel] = useState(0);
  const [currentWorld, setCurrentWorld] = useState('Fruit Forest');
  const [unlockedPowers, setUnlockedPowers] = useState<string[]>([]);
  const [isCollecting, setIsCollecting] = useState(false);
  const [unlockedFacts, setUnlockedFacts] = useState<string[]>([]);

  // Load saved progress
  useEffect(() => {
    const loadProgress = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('children')
          .select('hero_level, power_level, current_world, unlocked_powers, unlocked_facts')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          setHeroLevel(data.hero_level || 1);
          setPowerLevel(data.power_level || 0);
          setCurrentWorld(data.current_world || 'Fruit Forest');
          setUnlockedPowers(data.unlocked_powers || []);
          setUnlockedFacts(data.unlocked_facts || []);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
        toast({
          title: "Error",
          description: "Could not load saved progress",
          variant: "destructive",
        });
      }
    };

    loadProgress();
  }, [id, toast]);

  // Save progress when it changes
  useEffect(() => {
    const saveProgress = async () => {
      if (!id) return;

      try {
        const { error } = await supabase
          .from('children')
          .update({
            hero_level: heroLevel,
            power_level: powerLevel,
            current_world: currentWorld,
            unlocked_powers: unlockedPowers,
            unlocked_facts: unlockedFacts,
          })
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.error('Error saving progress:', error);
        toast({
          title: "Error",
          description: "Could not save progress",
          variant: "destructive",
        });
      }
    };

    saveProgress();
  }, [id, heroLevel, powerLevel, currentWorld, unlockedPowers, unlockedFacts, toast]);

  const currentWorldData = worldsData.find(w => w.name === currentWorld);
  if (!currentWorldData) {
    return <div>Error: World data not found</div>;
  }

  const getProgressColor = (level: number) => {
    return 'bg-[#98FF98]';  // Consistent soft mint green
  };

  const collectPower = () => {
    setIsCollecting(true);
    const powerGain = 20;
    const newPower = Math.min(powerLevel + powerGain, 100);
    setPowerLevel(newPower);

    // Unlock a new fact if available
    const lockedFacts = currentWorldData?.facts.filter(fact => !unlockedFacts.includes(fact)) || [];
    if (lockedFacts.length > 0) {
      setUnlockedFacts([...unlockedFacts, lockedFacts[0]]);
    }

    setTimeout(() => {
      setIsCollecting(false);
      if (newPower >= 100) {
        setUnlockedPowers([...unlockedPowers, currentWorldData.powerName]);
        setPowerLevel(0);
        setHeroLevel(heroLevel + 1);
        setUnlockedFacts([]);
        
        const currentIndex = worldsData.findIndex(w => w.name === currentWorld);
        if (currentIndex < worldsData.length - 1) {
          setCurrentWorld(worldsData[currentIndex + 1].name);
        }
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F0F8FF] p-6"> {/* Soft sky blue background */}
      <Card className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#32CD32]"> {/* Bright green title */}
              Food Hero Adventure
            </h2>
            <div className="bg-[#E6E6FA] text-[#4B0082] px-4 py-2 rounded-full font-semibold shadow-sm">
              Level {heroLevel}
            </div>
          </div>

          <Card className="p-4 bg-[#F0FFF0] shadow-md hover:shadow-lg transition-shadow duration-300 border-none"> {/* Mint green background */}
            <div className="flex items-center gap-2 mb-2">
              {currentWorldData.iconName === 'Apple' ? (
                <Apple className="h-6 w-6 text-[#FF4500] animate-bounce" />
              ) : (
                <Carrot className="h-6 w-6 text-[#FFA500] animate-bounce" />
              )}
              <h3 className="text-xl font-semibold text-[#32CD32]">{currentWorldData.name}</h3>
            </div>
            <p className="text-[#FF7F50]">{currentWorldData.description}</p>
          </Card>

          {unlockedFacts.length > 0 && (
            <div className="animate-fadeIn">
              <h4 className="text-lg font-semibold mb-3 text-center text-[#9370DB]">Fun Facts Discovered</h4>
              <div className="space-y-2">
                {unlockedFacts.map((fact, index) => (
                  <div
                    key={index}
                    className="bg-[#FFFACD] p-4 rounded-lg text-sm transform hover:scale-102 transition-transform duration-200 animate-slideIn shadow-sm"
                    style={{
                      animationDelay: `${index * 150}ms`
                    }}
                  >
                    <span className="text-[#696969]">{fact}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-[#4B0082]">Power Level</span>
              <span className="text-[#32CD32]">{powerLevel}%</span>
            </div>
            <div className="h-6 bg-[#F0FFF0] rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full ${getProgressColor(heroLevel)} transition-all duration-500`}
                style={{ width: `${powerLevel}%` }}
              />
            </div>
          </div>

          <Button
            className={`w-full transform transition-all duration-300 ${
              isCollecting 
                ? 'bg-[#FFA07A] animate-pulse scale-105' 
                : 'bg-[#FF7F50] hover:bg-[#FF6347] hover:scale-102'
            } text-white font-bold shadow-md hover:shadow-lg`}
            size="lg"
            onClick={collectPower}
            disabled={isCollecting}
          >
            {isCollecting ? 'Collecting Power!' : `Collect ${currentWorldData.powerName} Power!`}
          </Button>

          {unlockedPowers.length > 0 && (
            <div className="pt-6 border-t border-[#E6E6FA] animate-fadeIn">
              <h4 className="text-lg font-semibold mb-3 text-[#9370DB]">Your Special Powers</h4>
              <div className="flex flex-wrap gap-2">
                {unlockedPowers.map((power, index) => (
                  <div
                    key={index}
                    className="bg-[#F0FFF0] text-[#32CD32] px-4 py-2 rounded-full hover:scale-105 transition-transform duration-200 shadow-sm border border-[#98FF98]"
                  >
                    {power}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FoodQuest;
