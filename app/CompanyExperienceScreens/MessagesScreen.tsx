import React from 'react';
import BackendConversationList from '../../src/components/BackendConversationList';

export default function MessagesScreen({ navigation }: any) {
  return <BackendConversationList navigation={navigation} role="employer" />;
}
