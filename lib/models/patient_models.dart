class GlucoseReading {
  final int id;
  final int patientId;
  final double value;
  final String unit;
  final String source;
  final String? mealContext;
  final String? notes;
  final DateTime readingTime;
  final DateTime createdAt;
  final DateTime updatedAt;

  GlucoseReading({
    required this.id,
    required this.patientId,
    required this.value,
    required this.unit,
    required this.source,
    this.mealContext,
    this.notes,
    required this.readingTime,
    required this.createdAt,
    required this.updatedAt,
  });

  factory GlucoseReading.fromJson(Map<String, dynamic> json) {
    return GlucoseReading(
      id: json['id'],
      patientId: json['patient_id'],
      value: double.parse(json['value'].toString()),
      unit: json['unit'],
      source: json['source'],
      mealContext: json['meal_context'],
      notes: json['notes'],
      readingTime: DateTime.parse(json['reading_time']),
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'value': value,
      'unit': unit,
      'source': source,
      'meal_context': mealContext,
      'notes': notes,
      'reading_time': readingTime.toIso8601String(),
    };
  }
}

class HbA1cReport {
  final int id;
  final int patientId;
  final double hba1cValue;
  final DateTime testDate;
  final String labName;
  final String? notes;
  final double? targetRangeMin;
  final double? targetRangeMax;
  final DateTime createdAt;
  final DateTime updatedAt;

  HbA1cReport({
    required this.id,
    required this.patientId,
    required this.hba1cValue,
    required this.testDate,
    required this.labName,
    this.notes,
    this.targetRangeMin,
    this.targetRangeMax,
    required this.createdAt,
    required this.updatedAt,
  });

  factory HbA1cReport.fromJson(Map<String, dynamic> json) {
    return HbA1cReport(
      id: json['id'],
      patientId: json['patient_id'],
      hba1cValue: double.parse(json['hba1c_value'].toString()),
      testDate: DateTime.parse(json['test_date']),
      labName: json['lab_name'],
      notes: json['notes'],
      targetRangeMin: json['target_range_min'] != null
          ? double.parse(json['target_range_min'].toString())
          : null,
      targetRangeMax: json['target_range_max'] != null
          ? double.parse(json['target_range_max'].toString())
          : null,
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'hba1c_value': hba1cValue,
      'test_date': testDate.toIso8601String(),
      'lab_name': labName,
      'notes': notes,
      'target_range_min': targetRangeMin,
      'target_range_max': targetRangeMax,
    };
  }
}

class Mood {
  final int id;
  final int patientId;
  final String moodType;
  final int intensity;
  final String? notes;
  final DateTime moodTime;
  final DateTime createdAt;
  final DateTime updatedAt;

  Mood({
    required this.id,
    required this.patientId,
    required this.moodType,
    required this.intensity,
    this.notes,
    required this.moodTime,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Mood.fromJson(Map<String, dynamic> json) {
    return Mood(
      id: json['id'],
      patientId: json['patient_id'],
      moodType: json['mood_type'],
      intensity: json['intensity'],
      notes: json['notes'],
      moodTime: DateTime.parse(json['mood_time']),
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'mood_type': moodType,
      'intensity': intensity,
      'notes': notes,
      'mood_time': moodTime.toIso8601String(),
    };
  }
}

class NutritionLog {
  final int id;
  final int patientId;
  final String mealType;
  final String foodName;
  final double? calories;
  final double? carbs;
  final double? protein;
  final double? fat;
  final double? fiber;
  final String? notes;
  final DateTime mealTime;
  final DateTime createdAt;
  final DateTime updatedAt;

  NutritionLog({
    required this.id,
    required this.patientId,
    required this.mealType,
    required this.foodName,
    this.calories,
    this.carbs,
    this.protein,
    this.fat,
    this.fiber,
    this.notes,
    required this.mealTime,
    required this.createdAt,
    required this.updatedAt,
  });

  factory NutritionLog.fromJson(Map<String, dynamic> json) {
    return NutritionLog(
      id: json['id'],
      patientId: json['patient_id'],
      mealType: json['meal_type'],
      foodName: json['food_name'],
      calories: json['calories'] != null
          ? double.parse(json['calories'].toString())
          : null,
      carbs: json['carbs'] != null
          ? double.parse(json['carbs'].toString())
          : null,
      protein: json['protein'] != null
          ? double.parse(json['protein'].toString())
          : null,
      fat: json['fat'] != null
          ? double.parse(json['fat'].toString())
          : null,
      fiber: json['fiber'] != null
          ? double.parse(json['fiber'].toString())
          : null,
      notes: json['notes'],
      mealTime: DateTime.parse(json['meal_time']),
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'meal_type': mealType,
      'food_name': foodName,
      'calories': calories,
      'carbs': carbs,
      'protein': protein,
      'fat': fat,
      'fiber': fiber,
      'notes': notes,
      'meal_time': mealTime.toIso8601String(),
    };
  }
}

class WorkoutLog {
  final int id;
  final int patientId;
  final String exerciseName;
  final String exerciseType;
  final int? duration;
  final double? caloriesBurned;
  final String? notes;
  final DateTime workoutTime;
  final DateTime createdAt;
  final DateTime updatedAt;

  WorkoutLog({
    required this.id,
    required this.patientId,
    required this.exerciseName,
    required this.exerciseType,
    this.duration,
    this.caloriesBurned,
    this.notes,
    required this.workoutTime,
    required this.createdAt,
    required this.updatedAt,
  });

  factory WorkoutLog.fromJson(Map<String, dynamic> json) {
    return WorkoutLog(
      id: json['id'],
      patientId: json['patient_id'],
      exerciseName: json['exercise_name'],
      exerciseType: json['exercise_type'],
      duration: json['duration'],
      caloriesBurned: json['calories_burned'] != null
          ? double.parse(json['calories_burned'].toString())
          : null,
      notes: json['notes'],
      workoutTime: DateTime.parse(json['workout_time']),
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'exercise_name': exerciseName,
      'exercise_type': exerciseType,
      'duration': duration,
      'calories_burned': caloriesBurned,
      'notes': notes,
      'workout_time': workoutTime.toIso8601String(),
    };
  }
}
