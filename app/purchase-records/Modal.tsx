import { View, useTheme } from "@aws-amplify/ui-react";

export function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <View
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      backgroundColor="rgba(0,0,0,0.3)"
      style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <View
        backgroundColor="#fff"
        padding="2rem"
        borderRadius="8px"
        minWidth="320px"
        maxWidth="90vw"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </View>
    </View>
  );
}
