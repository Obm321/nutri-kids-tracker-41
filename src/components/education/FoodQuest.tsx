import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Apple, Carrot } from "lucide-react";

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
      'Pineapples take about 18-20 months to grow'
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
      'Cucumbers are 96% water'
    ]
  }
];

const FoodQuest = () => {
  const [heroLevel, setHeroLevel] = useState(1);
  const [powerLevel, setPowerLevel] = useState(0);
  const [currentWorld, setCurrentWorld] = useState('Fruit Forest');
  const [unlockedPowers, setUnlockedPowers] = useState<string[]>([]);
  const [isCollecting, setIsCollecting] = useState(false);
  const [unlockedFacts, setUnlockedFacts] = useState<string[]>([]);

  const currentWorldData = worldsData.find(w => w.name === currentWorld);
  if (!currentWorldData) {
    return <div>Error: World data not found</div>;
  }

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
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Food Hero Adventure</h2>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full">
          Level {heroLevel}
        </div>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          {currentWorldData.iconName === 'Apple' ? (
            <Apple className="h-6 w-6 text-red-500" />
          ) : (
            <Carrot className="h-6 w-6 text-orange-500" />
          )}
          <h3 className="text-xl font-semibold">{currentWorldData.name}</h3>
        </div>
        <p className="text-muted-foreground">{currentWorldData.description}</p>
      </Card>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <span>Power Level</span>
          <span>{powerLevel}%</span>
        </div>
        <Progress value={powerLevel} className="h-2" />
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={collectPower}
        disabled={isCollecting}
        variant={isCollecting ? "secondary" : "default"}
      >
        {isCollecting ? 'Collecting Power!' : `Collect ${currentWorldData.powerName} Power!`}
      </Button>

      {unlockedPowers.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-semibold mb-3">Your Special Powers</h4>
          <div className="flex flex-wrap gap-2">
            {unlockedPowers.map((power, index) => (
              <div
                key={index}
                className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full"
              >
                {power}
              </div>
            ))}
          </div>
        </div>
      )}

      {unlockedFacts.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-semibold mb-3">Fun Facts Discovered</h4>
          <div className="space-y-2">
            {unlockedFacts.map((fact, index) => (
              <div
                key={index}
                className="bg-muted p-3 rounded-lg text-sm"
              >
                {fact}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default FoodQuest;