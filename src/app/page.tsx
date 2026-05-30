import LoveDays from "@/components/home/LoveDays";
import Countdown from "@/components/home/Countdown";
import LoveQuote from "@/components/home/LoveQuote";
import ReminderList from "@/components/reminders/ReminderList";
import SurpriseCard from "@/components/surprises/SurpriseCard";
import PhotoMemory from "@/components/home/PhotoMemory";

export default function Home() {
  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-5 sm:space-y-6 animate-in fade-in duration-500">
      {/* 顶部欢迎区 */}
      <div className="text-center py-1 sm:py-2">
        <p className="text-love-400/80 text-xs sm:text-sm font-medium tracking-widest uppercase">
          记录我们在一起的每一天
        </p>
      </div>

      {/* 恋爱天数卡片 */}
      <LoveDays />

      {/* 照片回忆 */}
      <PhotoMemory />

      {/* 临近提醒 */}
      <ReminderList />

      {/* 惊喜建议 */}
      <SurpriseCard />

      {/* 纪念日倒计时 */}
      <Countdown />

      {/* 每日语录 */}
      <LoveQuote />

      {/* 底部 */}
      <footer className="text-center pb-6 sm:pb-10 pt-2">
        <p className="text-xs text-gray-400">
          每一天都值得被记录
        </p>
      </footer>
    </div>
  );
}
