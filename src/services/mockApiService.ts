import {
  mockLots,
  mockCropHistories,
  mockTreatments,
  mockHealthRecords,
  mockTasks,
  mockInfrastructure,
  mockUsers,
  getMockLotById,
  getMockCropHistoryById,
  getMockTreatmentById,
  getMockHealthRecordById,
  getMockTaskById,
  getMockCropHistoriesByLotId,
  getMockTreatmentsByLotId,
  getMockHealthRecordsByLotId,
  getMockTasksByLotId
} from './mockData';

// Mock API service that simulates API calls
class MockApiService {
  // Lots
  async getLots() {
    await this.delay(500); // Simulate network delay
    return mockLots;
  }

  async getLotById(id: string) {
    await this.delay(300);
    return getMockLotById(id);
  }

  // Crop Histories
  async getCropHistories() {
    await this.delay(500);
    return mockCropHistories;
  }

  async getCropHistoryById(id: string) {
    await this.delay(300);
    return getMockCropHistoryById(id);
  }

  async getCropHistoriesByLotId(lotId: string) {
    await this.delay(400);
    return getMockCropHistoriesByLotId(lotId);
  }

  // Treatments
  async getTreatments() {
    await this.delay(500);
    return mockTreatments;
  }

  async getTreatmentById(id: string) {
    await this.delay(300);
    return getMockTreatmentById(id);
  }

  async getTreatmentsByLotId(lotId: string) {
    await this.delay(400);
    return getMockTreatmentsByLotId(lotId);
  }

  // Health Records
  async getHealthRecords() {
    await this.delay(500);
    return mockHealthRecords;
  }

  async getHealthRecordById(id: string) {
    await this.delay(300);
    return getMockHealthRecordById(id);
  }

  async getHealthRecordsByLotId(lotId: string) {
    await this.delay(400);
    return getMockHealthRecordsByLotId(lotId);
  }

  // Tasks
  async getTasks() {
    await this.delay(500);
    return mockTasks;
  }

  async getTaskById(id: string) {
    await this.delay(300);
    return getMockTaskById(id);
  }

  async getTasksByLotId(lotId: string) {
    await this.delay(400);
    return getMockTasksByLotId(lotId);
  }

  // Infrastructure
  async getInfrastructure() {
    await this.delay(500);
    return mockInfrastructure;
  }

  // Users
  async getUsers() {
    await this.delay(300);
    return mockUsers;
  }

  // Utility method to simulate network delay
  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mockApiService = new MockApiService();
export default mockApiService;
