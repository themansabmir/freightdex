// components/ActionButtonContainer.tsx
interface DialogBoxProps {
  show: boolean;
  children: React.ReactNode;
}


const ActionButtonContainer: React.FC<DialogBoxProps> = ({ show, children }) => {
  if (!show) return null;

  return <div className="action_dialog_box">{children}</div>;
};

export default ActionButtonContainer;
