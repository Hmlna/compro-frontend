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
  // local "today" at midnight
  const today = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);

  // tomorrow (first selectable date)
  const tomorrow = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
    [today]
  );

  // normalize initialDate to local midnight and ignore if it's today or before
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

    // normalize clicked day to local midnight
    const picked = new Date(day.getFullYear(), day.getMonth(), day.getDate());

    // prevent selecting today or any past date
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
        // disable selectable days before tomorrow
        disabled={{ before: tomorrow }}
        // hide months before tomorrow (replaces deprecated fromDate)
        hidden={{ before: tomorrow }}
        // optionally start navigation at the month that contains tomorrow
        startMonth={new Date(tomorrow.getFullYear(), tomorrow.getMonth(), 1)}
      />
    </div>
  );
};

export default DayPickerWrapper;
