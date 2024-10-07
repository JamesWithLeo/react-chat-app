
interface IHoverProps {
  scale: number
}
export const varHover = (scale: IHoverProps) => ({
  hover: {
    scale: scale || 1.1
  }
});
