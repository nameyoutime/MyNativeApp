import * as React from "react"
import Svg, { Path } from "react-native-svg"

function ChevronDownIcon(props: any) {
  return (
    <Svg
      width={14}
      height={10}
      viewBox="0 0 14 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M6.3 9.139L.09 2.422A.343.343 0 010 2.19c0-.087.032-.171.09-.233L1.81.097A.293.293 0 012.025 0c.081 0 .158.035.216.096l4.49 4.855L11.22.096A.293.293 0 0111.435 0c.08 0 .158.035.215.096l1.72 1.861c.058.062.09.146.09.233 0 .087-.032.17-.09.232L7.162 9.14a.608.608 0 01-.198.142.569.569 0 01-.663-.142z"
        fill="#000"
      />
    </Svg>
  )
}

export default ChevronDownIcon
