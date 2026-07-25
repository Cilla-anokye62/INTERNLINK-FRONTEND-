import { useEffect } from 'react';
import { View } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import { useAppStore } from '../src/store/useAppStore';
import type { RootStackParamList } from '../types/navigation';

type Props = StackScreenProps<RootStackParamList, 'Onboarding'>;

export default function OnboardingRouter({ navigation }: Props) {
  const role = useAppStore((state) => state.userRole);

  useEffect(() => {
    if (role === 'student') {
      navigation.replace('AcademicInfo');
    } else if (role === 'employer') {
      navigation.replace('CompanyInformation');
    } else if (role === 'university') {
      navigation.replace('UniversityInfo');
    } else {
      navigation.replace('RoleSelection');
    }
  }, [navigation, role]);

  return <View />;
}
