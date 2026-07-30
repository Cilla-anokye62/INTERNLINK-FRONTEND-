import React from 'react';
import BackendChat from '../../src/components/BackendChat';

export default function ChatScreen({ route, navigation }: any) {
  return <BackendChat route={route} navigation={navigation} role="EMPLOYER" />;
}
