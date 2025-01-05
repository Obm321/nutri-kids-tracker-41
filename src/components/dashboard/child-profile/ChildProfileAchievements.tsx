interface ChildProfileAchievementsProps {
  achievements: number;
}

export const ChildProfileAchievements = ({ achievements }: ChildProfileAchievementsProps) => {
  return (
    <>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-[#FCD34D] rounded-lg p-2 text-center">
          <span className="text-lg font-bold">A</span>
        </div>
        <div className="bg-[#4ADE80] rounded-lg p-2 text-center">
          <span className="text-lg font-bold">B</span>
        </div>
        <div className="bg-[#60A5FA] rounded-lg p-2 text-center">
          <span className="text-lg font-bold">C</span>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        {achievements} achievements
      </div>
    </>
  );
};