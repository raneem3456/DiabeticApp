import 'package:get/get.dart';
import '../models/patient_models.dart';
import '../api/patient_api.dart';

class PatientController extends GetxController {
  // Observable variables
  final _isLoading = false.obs;
  final _glucoseReadings = <GlucoseReading>[].obs;
  final _hbA1cReports = <HbA1cReport>[].obs;
  final _moods = <Mood>[].obs;
  final _nutritionLogs = <NutritionLog>[].obs;
  final _workoutLogs = <WorkoutLog>[].obs;
  
  // Filter variables
  final _minGlucoseFilter = Rxn<double>();
  final _maxGlucoseFilter = Rxn<double>();
  final _dateRangeFilter = Rxn<DateTimeRange>();
  final _moodTypeFilter = Rxn<String>();
  final _mealTypeFilter = Rxn<String>();
  final _exerciseTypeFilter = Rxn<String>();

  // Getters
  bool get isLoading => _isLoading.value;
  List<GlucoseReading> get glucoseReadings => _glucoseReadings;
  List<HbA1cReport> get hbA1cReports => _hbA1cReports;
  List<Mood> get moods => _moods;
  List<NutritionLog> get nutritionLogs => _nutritionLogs;
  List<WorkoutLog> get workoutLogs => _workoutLogs;

  // Filter getters
  double? get minGlucoseFilter => _minGlucoseFilter.value;
  double? get maxGlucoseFilter => _maxGlucoseFilter.value;
  DateTimeRange? get dateRangeFilter => _dateRangeFilter.value;
  String? get moodTypeFilter => _moodTypeFilter.value;
  String? get mealTypeFilter => _mealTypeFilter.value;
  String? get exerciseTypeFilter => _exerciseTypeFilter.value;

  @override
  void onInit() {
    super.onInit();
    loadAllData();
  }

  // Load all patient data
  Future<void> loadAllData() async {
    await Future.wait([
      loadGlucoseReadings(),
      loadHbA1cReports(),
      loadMoods(),
      loadNutritionLogs(),
      loadWorkoutLogs(),
    ]);
  }

  // Glucose Readings
  Future<void> loadGlucoseReadings() async {
    _isLoading.value = true;
    try {
      final response = await PatientApi.getGlucoseReadings();
      if (response.success) {
        _glucoseReadings.value = response.data ?? [];
        _applyGlucoseFilters();
      } else {
        Get.snackbar('Error', response.message ?? 'Failed to load glucose readings');
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to load glucose readings: $e');
    } finally {
      _isLoading.value = false;
    }
  }

  Future<void> createGlucoseReading(Map<String, dynamic> data) async {
    try {
      final response = await PatientApi.createGlucoseReading(data);
      if (response.success) {
        await loadGlucoseReadings();
        Get.snackbar('Success', 'Glucose reading added successfully');
      } else {
        Get.snackbar('Error', response.message ?? 'Failed to add glucose reading');
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to add glucose reading: $e');
    }
  }

  Future<void> updateGlucoseReading(int id, Map<String, dynamic> data) async {
    try {
      final response = await PatientApi.updateGlucoseReading(id, data);
      if (response.success) {
        await loadGlucoseReadings();
        Get.snackbar('Success', 'Glucose reading updated successfully');
      } else {
        Get.snackbar('Error', response.message ?? 'Failed to update glucose reading');
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to update glucose reading: $e');
    }
  }

  Future<void> deleteGlucoseReading(int id) async {
    try {
      final response = await PatientApi.deleteGlucoseReading(id);
      if (response.success) {
        await loadGlucoseReadings();
        Get.snackbar('Success', 'Glucose reading deleted successfully');
      } else {
        Get.snackbar('Error', response.message ?? 'Failed to delete glucose reading');
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to delete glucose reading: $e');
    }
  }

  // HbA1c Reports
  Future<void> loadHbA1cReports() async {
    try {
      final response = await PatientApi.getHbA1cReports();
      if (response.success) {
        _hbA1cReports.value = response.data ?? [];
      } else {
        Get.snackbar('Error', response.message ?? 'Failed to load HbA1c reports');
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to load HbA1c reports: $e');
    }
  }

  Future<void> createHbA1cReport(Map<String, dynamic> data) async {
    try {
      final response = await PatientApi.createHbA1cReport(data);
      if (response.success) {
        await loadHbA1cReports();
        Get.snackbar('Success', 'HbA1c report added successfully');
      } else {
        Get.snackbar('Error', response.message ?? 'Failed to add HbA1c report');
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to add HbA1c report: $e');
    }
  }

  Future<void> updateHbA1cReport(int id, Map<String, dynamic> data) async {
    try {
      final response = await PatientApi.updateHbA1cReport(id, data);
      if (response.success) {
        await loadHbA1cReports();
        Get.snackbar('Success', 'HbA1c report updated successfully');
      } else {
        Get.snackbar('Error', response.message ?? 'Failed to update HbA1c report');
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to update HbA1c report: $e');
    }
  }

  Future<void> deleteHbA1cReport(int id) async {
    try {
      final response = await PatientApi.deleteHbA1cReport(id);
      if (response.success) {
        await loadHbA1cReports();
        Get.snackbar('Success', 'HbA1c report deleted successfully');
      } else {
        Get.snackbar('Error', response.message ?? 'Failed to delete HbA1c report');
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to delete HbA1c report: $e');
    }
  }

  // Moods
  Future<void> loadMoods() async {
    try {
      final response = await PatientApi.getMoods();
      if (response.success) {
        _moods.value = response.data ?? [];
        _applyMoodFilters();
      } else {
        Get.snackbar('Error', response.message ?? 'Failed to load moods');
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to load moods: $e');
    }
  }

  Future<void> createMood(Map<String, dynamic> data) async {
    try {
      final response = await PatientApi.createMood(data);
      if (response.success) {
        await loadMoods();
        Get.snackbar('Success', 'Mood entry added successfully');
      } else {
        Get.snackbar('Error', response.message ?? 'Failed to add mood entry');
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to add mood entry: $e');
    }
  }

  Future<void> updateMood(int id, Map<String, dynamic> data) async {
    try {
      final response = await PatientApi.updateMood(id, data);
      if (response.success) {
        await loadMoods();
        Get.snackbar('Success', 'Mood entry updated successfully');
      } else {
        Get.snackbar('Error', response.message ?? 'Failed to update mood entry');
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to update mood entry: $e');
    }
  }

  Future<void> deleteMood(int id) async {
    try {
      final response = await PatientApi.deleteMood(id);
      if (response.success) {
        await loadMoods();
        Get.snackbar('Success', 'Mood entry deleted successfully');
      } else {
        Get.snackbar('Error', response.message ?? 'Failed to delete mood entry');
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to delete mood entry: $e');
    }
  }

  // Nutrition Logs
  Future<void> loadNutritionLogs() async {
    try {
      final response = await PatientApi.getNutritionLogs();
      if (response.success) {
        _nutritionLogs.value = response.data ?? [];
        _applyNutritionFilters();
      } else {
        Get.snackbar('Error', response.message ?? 'Failed to load nutrition logs');
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to load nutrition logs: $e');
    }
  }

  Future<void> createNutritionLog(Map<String, dynamic> data) async {
    try {
      final response = await PatientApi.createNutritionLog(data);
      if (response.success) {
        await loadNutritionLogs();
        Get.snackbar('Success', 'Nutrition log added successfully');
      } else {
        Get.snackbar('Error', response.message ?? 'Failed to add nutrition log');
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to add nutrition log: $e');
    }
  }

  Future<void> updateNutritionLog(int id, Map<String, dynamic> data) async {
    try {
      final response = await PatientApi.updateNutritionLog(id, data);
      if (response.success) {
        await loadNutritionLogs();
        Get.snackbar('Success', 'Nutrition log updated successfully');
      } else {
        Get.snackbar('Error', response.message ?? 'Failed to update nutrition log');
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to update nutrition log: $e');
    }
  }

  Future<void> deleteNutritionLog(int id) async {
    try {
      final response = await PatientApi.deleteNutritionLog(id);
      if (response.success) {
        await loadNutritionLogs();
        Get.snackbar('Success', 'Nutrition log deleted successfully');
      } else {
        Get.snackbar('Error', response.message ?? 'Failed to delete nutrition log');
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to delete nutrition log: $e');
    }
  }

  // Workout Logs
  Future<void> loadWorkoutLogs() async {
    try {
      final response = await PatientApi.getWorkoutLogs();
      if (response.success) {
        _workoutLogs.value = response.data ?? [];
        _applyWorkoutFilters();
      } else {
        Get.snackbar('Error', response.message ?? 'Failed to load workout logs');
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to load workout logs: $e');
    }
  }

  Future<void> createWorkoutLog(Map<String, dynamic> data) async {
    try {
      final response = await PatientApi.createWorkoutLog(data);
      if (response.success) {
        await loadWorkoutLogs();
        Get.snackbar('Success', 'Workout log added successfully');
      } else {
        Get.snackbar('Error', response.message ?? 'Failed to add workout log');
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to add workout log: $e');
    }
  }

  Future<void> updateWorkoutLog(int id, Map<String, dynamic> data) async {
    try {
      final response = await PatientApi.updateWorkoutLog(id, data);
      if (response.success) {
        await loadWorkoutLogs();
        Get.snackbar('Success', 'Workout log updated successfully');
      } else {
        Get.snackbar('Error', response.message ?? 'Failed to update workout log');
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to update workout log: $e');
    }
  }

  Future<void> deleteWorkoutLog(int id) async {
    try {
      final response = await PatientApi.deleteWorkoutLog(id);
      if (response.success) {
        await loadWorkoutLogs();
        Get.snackbar('Success', 'Workout log deleted successfully');
      } else {
        Get.snackbar('Error', response.message ?? 'Failed to delete workout log');
      }
    } catch (e) {
      Get.snackbar('Error', 'Failed to delete workout log: $e');
    }
  }

  // Filter methods
  void setMinGlucoseFilter(String value) {
    if (value.isEmpty) {
      _minGlucoseFilter.value = null;
    } else {
      _minGlucoseFilter.value = double.tryParse(value);
    }
  }

  void setMaxGlucoseFilter(String value) {
    if (value.isEmpty) {
      _maxGlucoseFilter.value = null;
    } else {
      _maxGlucoseFilter.value = double.tryParse(value);
    }
  }

  void setDateRangeFilter(DateTimeRange? range) {
    _dateRangeFilter.value = range;
  }

  void setMoodTypeFilter(String? type) {
    _moodTypeFilter.value = type;
  }

  void setMealTypeFilter(String? type) {
    _mealTypeFilter.value = type;
  }

  void setExerciseTypeFilter(String? type) {
    _exerciseTypeFilter.value = type;
  }

  void applyGlucoseFilters() {
    _applyGlucoseFilters();
  }

  void applyMoodFilters() {
    _applyMoodFilters();
  }

  void applyNutritionFilters() {
    _applyNutritionFilters();
  }

  void applyWorkoutFilters() {
    _applyWorkoutFilters();
  }

  void clearAllFilters() {
    _minGlucoseFilter.value = null;
    _maxGlucoseFilter.value = null;
    _dateRangeFilter.value = null;
    _moodTypeFilter.value = null;
    _mealTypeFilter.value = null;
    _exerciseTypeFilter.value = null;
    
    // Reload data without filters
    loadAllData();
  }

  // Private filter application methods
  void _applyGlucoseFilters() {
    var filtered = _glucoseReadings;
    
    if (_minGlucoseFilter.value != null) {
      filtered = filtered.where((r) => r.value >= _minGlucoseFilter.value!).toList().obs;
    }
    
    if (_maxGlucoseFilter.value != null) {
      filtered = filtered.where((r) => r.value <= _maxGlucoseFilter.value!).toList().obs;
    }
    
    if (_dateRangeFilter.value != null) {
      filtered = filtered.where((r) => 
        r.readingDate.isAfter(_dateRangeFilter.value!.start) &&
        r.readingDate.isBefore(_dateRangeFilter.value!.end.add(const Duration(days: 1)))
      ).toList().obs;
    }
    
    _glucoseReadings.value = filtered;
  }

  void _applyMoodFilters() {
    var filtered = _moods;
    
    if (_moodTypeFilter.value != null) {
      filtered = filtered.where((m) => m.moodType == _moodTypeFilter.value).toList().obs;
    }
    
    if (_dateRangeFilter.value != null) {
      filtered = filtered.where((m) => 
        m.moodDate.isAfter(_dateRangeFilter.value!.start) &&
        m.moodDate.isBefore(_dateRangeFilter.value!.end.add(const Duration(days: 1)))
      ).toList().obs;
    }
    
    _moods.value = filtered;
  }

  void _applyNutritionFilters() {
    var filtered = _nutritionLogs;
    
    if (_mealTypeFilter.value != null) {
      filtered = filtered.where((n) => n.mealType == _mealTypeFilter.value).toList().obs;
    }
    
    if (_dateRangeFilter.value != null) {
      filtered = filtered.where((n) => 
        n.mealDate.isAfter(_dateRangeFilter.value!.start) &&
        n.mealDate.isBefore(_dateRangeFilter.value!.end.add(const Duration(days: 1)))
      ).toList().obs;
    }
    
    _nutritionLogs.value = filtered;
  }

  void _applyWorkoutFilters() {
    var filtered = _workoutLogs;
    
    if (_exerciseTypeFilter.value != null) {
      filtered = filtered.where((w) => w.exerciseType == _exerciseTypeFilter.value).toList().obs;
    }
    
    if (_dateRangeFilter.value != null) {
      filtered = filtered.where((w) => 
        w.workoutDate.isAfter(_dateRangeFilter.value!.start) &&
        w.workoutDate.isBefore(_dateRangeFilter.value!.end.add(const Duration(days: 1)))
      ).toList().obs;
    }
    
    _workoutLogs.value = filtered;
  }

  // Analytics methods
  double get averageGlucose {
    if (_glucoseReadings.isEmpty) return 0.0;
    final sum = _glucoseReadings.fold(0.0, (sum, reading) => sum + reading.value);
    return sum / _glucoseReadings.length;
  }

  double get latestHbA1c {
    if (_hbA1cReports.isEmpty) return 0.0;
    final sorted = _hbA1cReports.toList()
      ..sort((a, b) => b.testDate.compareTo(a.testDate));
    return sorted.first.value;
  }

  String get dominantMood {
    if (_moods.isEmpty) return 'Unknown';
    final moodCounts = <String, int>{};
    for (final mood in _moods) {
      moodCounts[mood.moodType] = (moodCounts[mood.moodType] ?? 0) + 1;
    }
    return moodCounts.entries
        .reduce((a, b) => a.value > b.value ? a : b)
        .key;
  }

  int get totalWorkoutsThisWeek {
    final now = DateTime.now();
    final weekStart = now.subtract(Duration(days: now.weekday - 1));
    return _workoutLogs.where((w) => 
      w.workoutDate.isAfter(weekStart) && w.workoutDate.isBefore(now.add(const Duration(days: 1)))
    ).length;
  }

  // Refresh methods
  Future<void> refreshGlucoseReadings() async {
    await loadGlucoseReadings();
  }

  Future<void> refreshHbA1cReports() async {
    await loadHbA1cReports();
  }

  Future<void> refreshMoods() async {
    await loadMoods();
  }

  Future<void> refreshNutritionLogs() async {
    await loadNutritionLogs();
  }

  Future<void> refreshWorkoutLogs() async {
    await loadWorkoutLogs();
  }

  Future<void> refreshAll() async {
    await loadAllData();
  }
}
