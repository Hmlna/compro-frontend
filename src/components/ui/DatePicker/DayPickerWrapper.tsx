import { useState, useMemo, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import styles from "@/components/ui/DatePicker/DayPickerWrapper.module.css";

interface DayPickerWrapperProps {
  onDateSelect?: (date?: Date) => void;
  className?: string;
  initialDate?: Date;
}

const DayPickerWrapper: React.FC<DayPickerWrapperProps> = ({
  onDateSelect,
  className,
  initialDate,
}) => {
  const today = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);

  const tomorrow = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
    [today]
  );

  const normalizedInitial = useMemo(() => {
    if (!initialDate) return undefined;
    const d = new Date(
      initialDate.getFullYear(),
      initialDate.getMonth(),
      initialDate.getDate()
    );
    return d < tomorrow ? undefined : d;
  }, [initialDate, tomorrow]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    normalizedInitial
  );

  useEffect(() => {
    setSelectedDate(normalizedInitial);
  }, [normalizedInitial]);

  const handleDayClick = (day?: Date) => {
    if (!day) {
      setSelectedDate(undefined);
      if (onDateSelect) onDateSelect(undefined);
      return;
    }

    const picked = new Date(day.getFullYear(), day.getMonth(), day.getDate());

    if (picked < tomorrow) return;

    setSelectedDate(picked);
    if (onDateSelect) onDateSelect(picked);
  };

  return (
    <div className={`${styles.dayPickerContainer} ${className ?? ""}`}>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={handleDayClick}
        disabled={{ before: tomorrow }}
        hidden={{ before: tomorrow }}
        startMonth={new Date(tomorrow.getFullYear(), tomorrow.getMonth(), 1)}
      />
    </div>
  );
};

export default DayPickerWrapper;
