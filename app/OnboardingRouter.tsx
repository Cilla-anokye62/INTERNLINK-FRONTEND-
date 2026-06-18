import { useEffect } from 'react';
import { View } from 'react-native';

export default function OnboardingRouter({ navigation, route }: any) {
  const role = route.params?.role;

  useEffect(() => {
    if (role === 'student') {
      navigation.replace('AcademicInfo');
    } else if (role === 'employer') {
      navigation.replace('CompanyInformation');
    } else if (role === 'university') {
      navigation.replace('UniversityInfo');
    }
  }, []);

  return <View />;
}