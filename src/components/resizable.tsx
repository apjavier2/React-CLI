import "./resizable.css";
import { ResizableBox } from "react-resizable";

interface ResizableProps {
  //either horizontal or vertical string
  direction: "horizontal" | "vertical";
  children?: React.ReactNode;
}

const Resizeable: React.FC<ResizableProps> = ({ direction, children }) => {
  return (
    <ResizableBox
      maxConstraints={[Infinity, window.innerHeight * 0.9]}
      minConstraints={[Infinity, 24]}
      height={300}
      width={Infinity}
      resizeHandles={["s"]}
    >
      {children}
    </ResizableBox>
  );
};

export default Resizeable;
