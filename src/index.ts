import client from './client';
import { useClient } from './useClient';

export * from '../types/client.d';
export * from '../types/wled-constants.d';
export * from '../types/wled-info.d';
export * from '../types/wled-segment.d';
export * from '../types/wled-state.d';

const useWledClient = useClient;
export { useWledClient };

const wledClient = client;
export default wledClient;