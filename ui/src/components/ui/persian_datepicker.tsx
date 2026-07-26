import { Controller, Control, FieldErrors } from 'react-hook-form';
import DatePicker  from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

interface PersianDatePickerProps {
  name: string;
  control: Control<any>;
  errors?: FieldErrors;
  label?: string;
}

const PersianDatePicker: React.FC<PersianDatePickerProps> = ({ name, control, errors, label }) => {
  const errorMessage = (errors as any)?.[name]?.message as string | undefined;
  return (
    <div className="mb-4 w-full ">
      {label && <label className="block mb-1 font-medium">{label}</label>}
      
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DatePicker
            value={field.value || ''} // support initial empty value
            inputClass={` w-full border px-2 py-2 rounded-md ${errorMessage ? 'border-red-500' : ''}`}
           containerClassName="w-full"
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            onChange={(date) => {
              if (date) {
                field.onChange(date.format('YYYY/MM/DD')); // set value in form
              } else {
                field.onChange('');
              }
            }}
          />
        )}
      />

      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default PersianDatePicker;