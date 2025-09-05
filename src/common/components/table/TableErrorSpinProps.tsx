import { SpinProps } from 'antd';

import ErrorAlert from '../display/ErrorAlert';

const TableErrorSpinProps: SpinProps = {
  indicator: (
    <ErrorAlert className="absolute left-1/2 top-1/2 flex size-auto -translate-x-1/2 -translate-y-1/2 text-left text-base" />
  ),
};

export default TableErrorSpinProps;
