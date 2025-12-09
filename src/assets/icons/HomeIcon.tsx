import * as React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

function HomeIcon(props: any) {
  return (
    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
      <Svg
        width={26}
        height={12}
        viewBox="0 0 26 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <Path
          d="M24.958 9.743l-3.413-2.837V.546a.485.485 0 00-.14-.359.484.484 0 00-.36-.14h-2.992a.486.486 0 00-.359.14.486.486 0 00-.14.359v3.04L13.751.405A1.819 1.819 0 0012.566 0a1.82 1.82 0 00-1.184.405L.173 9.743a.453.453 0 00-.171.335c-.01.14.026.263.109.366l.966 1.154c.084.093.193.15.328.171a.58.58 0 00.374-.109l10.787-8.994 10.787 8.994a.48.48 0 00.327.109h.047a.533.533 0 00.328-.171l.966-1.154a.505.505 0 00.109-.366.454.454 0 00-.172-.335z"
          fill="#fff"
        />
      </Svg>
      <View style={{ marginTop: -6.8, marginLeft: -1.5 }}>
        <Svg
          width={18}
          height={16}
          viewBox="0 0 18 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <Path
            d="M8.979 0L.016 7.39c0 .01-.003.025-.008.046A.213.213 0 000 7.482v7.482c0 .27.099.505.296.702a.96.96 0 00.702.296h5.985V9.977h3.991v5.986h5.986c.27 0 .504-.1.701-.297a.958.958 0 00.297-.702V7.482a.22.22 0 00-.016-.093L8.98 0z"
            fill="#fff"
          />
        </Svg>
      </View>
    </View>
  );
}

export default HomeIcon;
