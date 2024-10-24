import client from './client';
export * from '../types/client.d';
export * from '../types/wled-constants.d';
export * from '../types/wled-info.d';
export * from '../types/wled-segment.d';
export * from '../types/wled-state.d';
declare const wledClient: typeof client;
export default wledClient;
