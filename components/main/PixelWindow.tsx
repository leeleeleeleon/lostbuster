import type { ComponentPropsWithoutRef, ElementType } from "react";
import styles from "./PixelWindow.module.css";

type Props<T extends ElementType> = {
  as?: T;
  // 누를 수 있는 창이면 hover 때 한 톤 밝아진다
  interactive?: boolean;
} & ComponentPropsWithoutRef<T>;

/** RPG 대화창: 크림 안쪽 테두리 + 남색 바깥 테두리를 box-shadow 계단으로 그린 2중 픽셀 테두리 */
export default function PixelWindow<T extends ElementType = "div">({ as, interactive, className = "", ...rest }: Props<T>) {
  const Tag: ElementType = as ?? "div";
  return <Tag className={`${styles.win} ${interactive ? styles.interactive : ""} ${className}`} {...rest} />;
}
