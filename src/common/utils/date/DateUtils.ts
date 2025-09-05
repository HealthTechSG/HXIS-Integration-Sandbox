import dayjs from 'dayjs';

const DateUtils = {
  //* Format related -----------------------------------------------------------
  // TODO: Rename this into "formatDateForDisplay" or something.
  formatDate: (date: dayjs.ConfigType) =>
    date ? dayjs(date).format('DD MMM YYYY') : date,

  formatDateForFhir: (date: dayjs.ConfigType) =>
    date ? dayjs(date).format('YYYY-MM-DD') : date,

  //* --------------------------------------------------------------------------
  /**
   * This will loop transform all the specified fields in the object into Dayjs object.
   * Main usage will be in the form initialValues.
   *
   * Eg: transformDatesInObject(inputObject, ['createdDate', 'updatedDate'])
   *
   * If the createdDate and updatedDate are string, it will be transformed
   * into Dayjs object.
   */
  transformDatesInObject: <TData>(input: TData, fields: Array<keyof TData>) => {
    const output: any = { ...input };

    fields.forEach((field) => {
      if (output[field]) {
        output[field] = dayjs(output[field]);
      }
    });

    return output;
  },

  //* --------------------------------------------------------------------------
};

export default DateUtils;
