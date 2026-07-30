import React from 'react';
import BackendConversationList from '../../src/components/BackendConversationList';

export default function StudentMessagesScreen({ navigation }: any) {
  return <BackendConversationList navigation={navigation} role="student" />;
}
