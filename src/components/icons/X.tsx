export const X = ({
  style,
  className,
  onClick,
}: {
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
    className={className}
    onClick={onClick}
  >
    <path
      d="M25.7686 5.17017L17.9744 13.9304L27.1436 25.851H19.9632L14.34 18.6212L7.90579 25.851H4.33604L12.6727 16.481L3.87769 5.17017H11.2383L16.3211 11.7785L22.1988 5.17017H25.7686ZM20.9489 23.7511H22.9257L10.1652 7.15977H8.04384L20.9489 23.7511Z"
      fill="#803BF1"
    />
  </svg>
);
