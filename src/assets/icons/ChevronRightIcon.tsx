import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function ChevronRightIcon(props: any) {
  return (
    <Svg
      width={10}
      height={14}
      viewBox="0 0 10 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M8.922 7.355l-6.557 6.38a.326.326 0 01-.454 0L.094 11.966a.308.308 0 010-.442l4.74-4.612L.094 2.3a.308.308 0 010-.442L1.911.092a.326.326 0 01.454 0L8.922 6.47a.624.624 0 01.188.442.61.61 0 01-.188.442z"
        fill="#000"
      />
    </Svg>
  );
}

export default ChevronRightIcon;
