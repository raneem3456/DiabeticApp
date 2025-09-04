import 'package:dio/dio.dart';
import '../models/base_models.dart';
import '../models/patient_models.dart';
import 'client.dart';

class PatientApi {
  static final Dio _dio = ApiClient.dio;

  // Glucose Readings
  static Future<ApiResponse<List<GlucoseReading>>> getGlucoseReadings() async {
    try {
      final response = await _dio.get('/patient/glucose-readings');

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data['data'];
        final readings = data.map((json) => GlucoseReading.fromJson(json)).toList();
        return ApiResponse<List<GlucoseReading>>(
          success: true,
          message: 'Glucose readings retrieved successfully',
          data: readings,
        );
      } else {
        return ApiResponse<List<GlucoseReading>>.error(
          response.data['message'] ?? 'Failed to get glucose readings',
        );
      }
    } on DioException catch (e) {
      return ApiResponse<List<GlucoseReading>>.error(
        e.message ?? 'Network error occurred',
      );
    } catch (e) {
      return ApiResponse<List<GlucoseReading>>.error(
        'An unexpected error occurred',
      );
    }
  }

  static Future<ApiResponse<GlucoseReading>> createGlucoseReading(
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _dio.post('/patient/glucose-readings', data: data);

      if (response.statusCode == 201) {
        final reading = GlucoseReading.fromJson(response.data['data']);
        return ApiResponse<GlucoseReading>(
          success: true,
          message: 'Glucose reading created successfully',
          data: reading,
        );
      } else {
        return ApiResponse<GlucoseReading>.error(
          response.data['message'] ?? 'Failed to create glucose reading',
          response.data['errors'],
        );
      }
    } on DioException catch (e) {
      if (e.response?.data != null) {
        return ApiResponse<GlucoseReading>.error(
          e.response!.data['message'] ?? 'Failed to create glucose reading',
          e.response!.data['errors'],
        );
      }
      return ApiResponse<GlucoseReading>.error(
        e.message ?? 'Network error occurred',
      );
    } catch (e) {
      return ApiResponse<GlucoseReading>.error(
        'An unexpected error occurred',
      );
    }
  }

  static Future<ApiResponse<GlucoseReading>> updateGlucoseReading(
    int id,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _dio.put('/patient/glucose-readings/$id', data: data);

      if (response.statusCode == 200) {
        final reading = GlucoseReading.fromJson(response.data['data']);
        return ApiResponse<GlucoseReading>(
          success: true,
          message: 'Glucose reading updated successfully',
          data: reading,
        );
      } else {
        return ApiResponse<GlucoseReading>.error(
          response.data['message'] ?? 'Failed to update glucose reading',
          response.data['errors'],
        );
      }
    } on DioException catch (e) {
      if (e.response?.data != null) {
        return ApiResponse<GlucoseReading>.error(
          e.response!.data['message'] ?? 'Failed to update glucose reading',
          e.response!.data['errors'],
        );
      }
      return ApiResponse<GlucoseReading>.error(
        e.message ?? 'Network error occurred',
      );
    } catch (e) {
      return ApiResponse<GlucoseReading>.error(
        'An unexpected error occurred',
      );
    }
  }

  static Future<ApiResponse<void>> deleteGlucoseReading(int id) async {
    try {
      final response = await _dio.delete('/patient/glucose-readings/$id');

      if (response.statusCode == 200) {
        return ApiResponse<void>(
          success: true,
          message: 'Glucose reading deleted successfully',
        );
      } else {
        return ApiResponse<void>.error(
          response.data['message'] ?? 'Failed to delete glucose reading',
        );
      }
    } on DioException catch (e) {
      return ApiResponse<void>.error(
        e.message ?? 'Network error occurred',
      );
    } catch (e) {
      return ApiResponse<void>.error(
        'An unexpected error occurred',
      );
    }
  }

  // HbA1c Reports
  static Future<ApiResponse<List<HbA1cReport>>> getHbA1cReports() async {
    try {
      final response = await _dio.get('/patient/hba1c-reports');

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data['data'];
        final reports = data.map((json) => HbA1cReport.fromJson(json)).toList();
        return ApiResponse<List<HbA1cReport>>(
          success: true,
          message: 'HbA1c reports retrieved successfully',
          data: reports,
        );
      } else {
        return ApiResponse<List<HbA1cReport>>.error(
          response.data['message'] ?? 'Failed to get HbA1c reports',
        );
      }
    } on DioException catch (e) {
      return ApiResponse<List<HbA1cReport>>.error(
        e.message ?? 'Network error occurred',
      );
    } catch (e) {
      return ApiResponse<List<HbA1cReport>>.error(
        'An unexpected error occurred',
      );
    }
  }

  static Future<ApiResponse<HbA1cReport>> createHbA1cReport(
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _dio.post('/patient/hba1c-reports', data: data);

      if (response.statusCode == 201) {
        final report = HbA1cReport.fromJson(response.data['data']);
        return ApiResponse<HbA1cReport>(
          success: true,
          message: 'HbA1c report created successfully',
          data: report,
        );
      } else {
        return ApiResponse<HbA1cReport>.error(
          response.data['message'] ?? 'Failed to create HbA1c report',
          response.data['errors'],
        );
      }
    } on DioException catch (e) {
      if (e.response?.data != null) {
        return ApiResponse<HbA1cReport>.error(
          e.response!.data['message'] ?? 'Failed to create HbA1c report',
          e.response!.data['errors'],
        );
      }
      return ApiResponse<HbA1cReport>.error(
        e.message ?? 'Network error occurred',
      );
    } catch (e) {
      return ApiResponse<HbA1cReport>.error(
        'An unexpected error occurred',
      );
    }
  }

  // Moods
  static Future<ApiResponse<List<Mood>>> getMoods() async {
    try {
      final response = await _dio.get('/patient/moods');

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data['data'];
        final moods = data.map((json) => Mood.fromJson(json)).toList();
        return ApiResponse<List<Mood>>(
          success: true,
          message: 'Moods retrieved successfully',
          data: moods,
        );
      } else {
        return ApiResponse<List<Mood>>.error(
          response.data['message'] ?? 'Failed to get moods',
        );
      }
    } on DioException catch (e) {
      return ApiResponse<List<Mood>>.error(
        e.message ?? 'Network error occurred',
      );
    } catch (e) {
      return ApiResponse<List<Mood>>.error(
        'An unexpected error occurred',
      );
    }
  }

  static Future<ApiResponse<Mood>> createMood(Map<String, dynamic> data) async {
    try {
      final response = await _dio.post('/patient/moods', data: data);

      if (response.statusCode == 201) {
        final mood = Mood.fromJson(response.data['data']);
        return ApiResponse<Mood>(
          success: true,
          message: 'Mood created successfully',
          data: mood,
        );
      } else {
        return ApiResponse<Mood>.error(
          response.data['message'] ?? 'Failed to create mood',
          response.data['errors'],
        );
      }
    } on DioException catch (e) {
      if (e.response?.data != null) {
        return ApiResponse<Mood>.error(
          e.response!.data['message'] ?? 'Failed to create mood',
          e.response!.data['errors'],
        );
      }
      return ApiResponse<Mood>.error(
        e.message ?? 'Network error occurred',
      );
    } catch (e) {
      return ApiResponse<Mood>.error(
        'An unexpected error occurred',
      );
    }
  }

  // Nutrition Logs
  static Future<ApiResponse<List<NutritionLog>>> getNutritionLogs() async {
    try {
      final response = await _dio.get('/patient/nutrition-logs');

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data['data'];
        final logs = data.map((json) => NutritionLog.fromJson(json)).toList();
        return ApiResponse<List<NutritionLog>>(
          success: true,
          message: 'Nutrition logs retrieved successfully',
          data: logs,
        );
      } else {
        return ApiResponse<List<NutritionLog>>.error(
          response.data['message'] ?? 'Failed to get nutrition logs',
        );
      }
    } on DioException catch (e) {
      return ApiResponse<List<NutritionLog>>.error(
        e.message ?? 'Network error occurred',
      );
    } catch (e) {
      return ApiResponse<List<NutritionLog>>.error(
        'An unexpected error occurred',
      );
    }
  }

  static Future<ApiResponse<NutritionLog>> createNutritionLog(
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _dio.post('/patient/nutrition-logs', data: data);

      if (response.statusCode == 201) {
        final log = NutritionLog.fromJson(response.data['data']);
        return ApiResponse<NutritionLog>(
          success: true,
          message: 'Nutrition log created successfully',
          data: log,
        );
      } else {
        return ApiResponse<NutritionLog>.error(
          response.data['message'] ?? 'Failed to create nutrition log',
          response.data['errors'],
        );
      }
    } on DioException catch (e) {
      if (e.response?.data != null) {
        return ApiResponse<NutritionLog>.error(
          e.response!.data['message'] ?? 'Failed to create nutrition log',
          e.response!.data['errors'],
        );
      }
      return ApiResponse<NutritionLog>.error(
        e.message ?? 'Network error occurred',
      );
    } catch (e) {
      return ApiResponse<NutritionLog>.error(
        'An unexpected error occurred',
      );
    }
  }

  // Workout Logs
  static Future<ApiResponse<List<WorkoutLog>>> getWorkoutLogs() async {
    try {
      final response = await _dio.get('/patient/workout-logs');

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data['data'];
        final logs = data.map((json) => WorkoutLog.fromJson(json)).toList();
        return ApiResponse<List<WorkoutLog>>(
          success: true,
          message: 'Workout logs retrieved successfully',
          data: logs,
        );
      } else {
        return ApiResponse<List<WorkoutLog>>.error(
          response.data['message'] ?? 'Failed to get workout logs',
        );
      }
    } on DioException catch (e) {
      return ApiResponse<List<WorkoutLog>>.error(
        e.message ?? 'Network error occurred',
      );
    } catch (e) {
      return ApiResponse<List<WorkoutLog>>.error(
        'An unexpected error occurred',
      );
    }
  }

  static Future<ApiResponse<WorkoutLog>> createWorkoutLog(
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await _dio.post('/patient/workout-logs', data: data);

      if (response.statusCode == 201) {
        final log = WorkoutLog.fromJson(response.data['data']);
        return ApiResponse<WorkoutLog>(
          success: true,
          message: 'Workout log created successfully',
          data: log,
        );
      } else {
        return ApiResponse<WorkoutLog>.error(
          response.data['message'] ?? 'Failed to create workout log',
          response.data['errors'],
        );
      }
    } on DioException catch (e) {
      if (e.response?.data != null) {
        return ApiResponse<WorkoutLog>.error(
          e.response!.data['message'] ?? 'Failed to create workout log',
          e.response!.data['errors'],
        );
      }
      return ApiResponse<WorkoutLog>.error(
        e.message ?? 'Network error occurred',
      );
    } catch (e) {
      return ApiResponse<WorkoutLog>.error(
        'An unexpected error occurred',
      );
    }
  }
}
