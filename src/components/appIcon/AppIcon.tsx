import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { Ionicons, IoniconsIconName } from '@react-native-vector-icons/ionicons';

export interface AppIconProps {
  name: IoniconsIconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 24,
  color = '#000000',
  style,
}) => {
  return (
    <Ionicons
      name={name}
      size={size}
      color={color}
      style={style}
    />
  );
};

export default AppIcon;
