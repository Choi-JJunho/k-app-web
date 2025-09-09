interface Meal {
  date: string;
  dining_time: string;
  place: string;
  price: string;
  kcal: string;
  menu: string[];
}

interface MealCardProps {
  meal: Meal;
}

export default function MealCard({ meal }: MealCardProps) {
  const diningTimeLabels = {
    breakfast: "조식",
    lunch: "중식",
    dinner: "석식",
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-orange-400 to-red-400 text-white p-4 rounded-t-2xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold">
            {
              diningTimeLabels[
                meal.dining_time as keyof typeof diningTimeLabels
              ]
            }
          </h2>
          <span className="text-sm opacity-90">
            {new Date(meal.date).toLocaleDateString("ko-KR")}
          </span>
        </div>
        <div className="flex gap-2 text-xs flex-wrap">
          <span className="bg-white/20 px-2 py-1 rounded-lg flex items-center gap-1">
            📍 {meal.place}
          </span>
          <span className="bg-white/20 px-2 py-1 rounded-lg flex items-center gap-1">
            💰 {meal.price}원
          </span>
          <span className="bg-white/20 px-2 py-1 rounded-lg flex items-center gap-1">
            🔥 {meal.kcal}kcal
          </span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-600 mb-3">메뉴</h3>
        <div className="grid gap-2">
          {meal.menu.map((item, itemIndex) => (
            <div
              key={itemIndex}
              className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors"
            >
              <span className="text-orange-400 mr-3 flex-shrink-0">•</span>
              <span className="text-gray-700 font-medium text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
