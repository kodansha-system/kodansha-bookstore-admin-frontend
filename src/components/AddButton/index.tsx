const AddButton = ({
  children,
  onClick,
}: {
  children: string;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-green-600 text-white rounded-md py-2 px-5 hover:bg-opacity-80"
    >
      {children}
    </div>
  );
};

export default AddButton;
