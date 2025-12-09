import * as React from "react"
import Svg, { Path } from "react-native-svg"

function ChevronLeftIcon(props:any) {
  return (
    <Svg
      width={12}
      height={18}
      viewBox="0 0 12 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.324 0L0 9l9.324 9 1.997-1.933L3.999 9l7.322-7.067L9.324 0z"
        fill="#fff"
      />
    </Svg>
  )
}

export default ChevronLeftIcon
