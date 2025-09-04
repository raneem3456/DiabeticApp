import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import '../../controllers/patient_controller.dart';
import '../../models/patient_models.dart';
import '../../themes/app_theme.dart';
import '../../utils/constants.dart';

class WorkoutLogsPage extends StatelessWidget {
  const WorkoutLogsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<PatientController>();
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Workout Logs'),
        backgroundColor: AppTheme.primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () => _showFilterDialog(context, controller),
          ),
        ],
      ),
      body: Obx(() {
        if (controller.isLoading.value) {
          return const Center(child: CircularProgressIndicator());
        }
        
        if (controller.workoutLogs.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.fitness_center_outlined,
                  size: 64,
                  color: Colors.grey[400],
                ),
                const SizedBox(height: 16),
                Text(
                  'No workout logs yet',
                  style: TextStyle(
                    fontSize: 18,
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Track your exercises and physical activities',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[500],
                  ),
                ),
              ],
            ),
          );
        }
        
        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: controller.workoutLogs.length,
          itemBuilder: (context, index) {
            final log = controller.workoutLogs[index];
            return _WorkoutLogCard(
              log: log,
              onEdit: () => _showEditDialog(context, controller, log),
              onDelete: () => _showDeleteDialog(context, controller, log),
            );
          },
        );
      }),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddDialog(context, controller),
        backgroundColor: AppTheme.primaryColor,
        foregroundColor: Colors.white,
        child: const Icon(Icons.add),
      ),
    );
  }

  void _showAddDialog(BuildContext context, PatientController controller) {
    showDialog(
      context: context,
      builder: (context) => _WorkoutLogDialog(
        controller: controller,
        log: null,
      ),
    );
  }

  void _showEditDialog(BuildContext context, PatientController controller, WorkoutLog log) {
    showDialog(
      context: context,
      builder: (context) => _WorkoutLogDialog(
        controller: controller,
        log: log,
      ),
    );
  }

  void _showDeleteDialog(BuildContext context, PatientController controller, WorkoutLog log) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Workout Log'),
        content: Text('Are you sure you want to delete this workout log?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              controller.deleteWorkoutLog(log.id);
              Navigator.of(context).pop();
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  void _showFilterDialog(BuildContext context, PatientController controller) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Filter Workout Logs'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(
                labelText: 'Exercise Type',
                border: OutlineInputBorder(),
              ),
              value: controller.exerciseTypeFilter,
              items: [
                const DropdownMenuItem(value: null, child: Text('All Exercises')),
                ...AppConstants.exerciseTypes.map((type) => DropdownMenuItem(
                  value: type,
                  child: Text(type),
                )),
              ],
              onChanged: (value) => controller.setExerciseTypeFilter(value),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              controller.applyWorkoutFilters();
              Navigator.of(context).pop();
            },
            child: const Text('Apply'),
          ),
        ],
      ),
    );
  }
}

class _WorkoutLogCard extends StatelessWidget {
  final WorkoutLog log;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const _WorkoutLogCard({
    required this.log,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final exerciseColor = _getExerciseColor(log.exerciseType);

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: exerciseColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    _getExerciseIcon(log.exerciseType),
                    color: exerciseColor,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        log.exerciseType,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      if (log.duration != null)
                        Text(
                          '${log.duration!.toStringAsFixed(0)} minutes',
                          style: TextStyle(
                            color: exerciseColor,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                    ],
                  ),
                ),
                PopupMenuButton<String>(
                  onSelected: (value) {
                    if (value == 'edit') onEdit();
                    if (value == 'delete') onDelete();
                  },
                  itemBuilder: (context) => [
                    const PopupMenuItem(
                      value: 'edit',
                      child: Row(
                        children: [
                          Icon(Icons.edit, size: 20),
                          SizedBox(width: 8),
                          Text('Edit'),
                        ],
                      ),
                    ),
                    const PopupMenuItem(
                      value: 'delete',
                      child: Row(
                        children: [
                          Icon(Icons.delete, size: 20),
                          SizedBox(width: 8),
                          Text('Delete'),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _InfoChip(
                  icon: Icons.access_time,
                  label: DateFormat('MMM dd, yyyy').format(log.workoutTime),
                ),
                const SizedBox(width: 8),
                _InfoChip(
                  icon: Icons.schedule,
                  label: DateFormat('HH:mm').format(log.workoutTime),
                ),
              ],
            ),
            const SizedBox(height: 12),
            _WorkoutInfoRow(
              duration: log.duration?.toDouble(),
              calories: log.caloriesBurned,
              distance: null,
              intensity: null,
            ),
            if (log.notes?.isNotEmpty == true) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  log.notes!,
                  style: TextStyle(
                    color: Colors.grey[700],
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Color _getExerciseColor(String exerciseType) {
    switch (exerciseType.toLowerCase()) {
      case 'cardio':
      case 'running':
      case 'cycling':
      case 'swimming':
        return Colors.red;
      case 'strength':
      case 'weightlifting':
      case 'resistance':
        return Colors.blue;
      case 'flexibility':
      case 'yoga':
      case 'stretching':
        return Colors.green;
      case 'sports':
      case 'basketball':
      case 'soccer':
      case 'tennis':
        return Colors.orange;
      default:
        return AppTheme.primaryColor;
    }
  }

  IconData _getExerciseIcon(String exerciseType) {
    switch (exerciseType.toLowerCase()) {
      case 'cardio':
      case 'running':
        return Icons.directions_run;
      case 'cycling':
        return Icons.directions_bike;
      case 'swimming':
        return Icons.pool;
      case 'strength':
      case 'weightlifting':
        return Icons.fitness_center;
      case 'flexibility':
      case 'yoga':
        return Icons.accessibility_new;
      case 'sports':
        return Icons.sports_basketball;
      default:
        return Icons.fitness_center;
    }
  }
}

class _WorkoutInfoRow extends StatelessWidget {
  final double? duration;
  final double? calories;
  final double? distance;
  final double? intensity;

  const _WorkoutInfoRow({
    this.duration,
    this.calories,
    this.distance,
    this.intensity,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        if (duration != null)
          _WorkoutChip(
            label: 'Duration',
            value: '${duration!.toStringAsFixed(0)} min',
            color: Colors.blue,
            icon: Icons.timer,
          ),
        if (calories != null)
          _WorkoutChip(
            label: 'Calories',
            value: '${calories!.toStringAsFixed(0)}',
            color: Colors.orange,
            icon: Icons.local_fire_department,
          ),
        if (distance != null)
          _WorkoutChip(
            label: 'Distance',
            value: '${distance!.toStringAsFixed(1)} km',
            color: Colors.green,
            icon: Icons.straighten,
          ),
        if (intensity != null)
          _WorkoutChip(
            label: 'Intensity',
            value: '${intensity!.toStringAsFixed(1)}/10',
            color: Colors.red,
            icon: Icons.speed,
          ),
      ],
    );
  }
}

class _WorkoutChip extends StatelessWidget {
  final String label;
  final String value;
  final Color color;
  final IconData icon;

  const _WorkoutChip({
    required this.label,
    required this.value,
    required this.color,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: color),
          const SizedBox(width: 4),
          Column(
            children: [
              Text(
                value,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
              ),
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  color: color.withOpacity(0.8),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _InfoChip({
    required this.icon,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: Colors.grey[600]),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }
}

class _WorkoutLogDialog extends StatefulWidget {
  final PatientController controller;
  final WorkoutLog? log;

  const _WorkoutLogDialog({
    required this.controller,
    this.log,
  });

  @override
  State<_WorkoutLogDialog> createState() => _WorkoutLogDialogState();
}

class _WorkoutLogDialogState extends State<_WorkoutLogDialog> {
  final _formKey = GlobalKey<FormState>();
  final _durationController = TextEditingController();
  final _caloriesController = TextEditingController();
  final _distanceController = TextEditingController();
  final _intensityController = TextEditingController();
  final _notesController = TextEditingController();
  String _selectedExerciseType = AppConstants.exerciseTypes.first;
  DateTime _selectedDate = DateTime.now();
  TimeOfDay _selectedTime = TimeOfDay.now();

  @override
  void initState() {
    super.initState();
    if (widget.log != null) {
      _selectedExerciseType = widget.log!.exerciseType;
      _durationController.text = widget.log!.duration?.toString() ?? '';
      _caloriesController.text = widget.log!.caloriesBurned?.toString() ?? '';
      _distanceController.text = '';
      _intensityController.text = '';
      _notesController.text = widget.log!.notes ?? '';
      _selectedDate = widget.log!.workoutTime;
      _selectedTime = TimeOfDay.fromDateTime(widget.log!.workoutTime);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(widget.log == null ? 'Add Workout Log' : 'Edit Workout Log'),
      content: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButtonFormField<String>(
                value: _selectedExerciseType,
                decoration: const InputDecoration(
                  labelText: 'Exercise Type',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.fitness_center),
                ),
                items: AppConstants.exerciseTypes.map((type) {
                  return DropdownMenuItem(
                    value: type,
                    child: Text(type),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedExerciseType = value!;
                  });
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please select exercise type';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _durationController,
                      decoration: const InputDecoration(
                        labelText: 'Duration (min)',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.timer),
                      ),
                      keyboardType: TextInputType.number,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      controller: _caloriesController,
                      decoration: const InputDecoration(
                        labelText: 'Calories',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.local_fire_department),
                      ),
                      keyboardType: TextInputType.number,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _distanceController,
                      decoration: const InputDecoration(
                        labelText: 'Distance (km)',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.straighten),
                      ),
                      keyboardType: TextInputType.number,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      controller: _intensityController,
                      decoration: const InputDecoration(
                        labelText: 'Intensity (1-10)',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.speed),
                      ),
                      keyboardType: TextInputType.number,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: InkWell(
                      onTap: () async {
                        final date = await showDatePicker(
                          context: context,
                          initialDate: _selectedDate,
                          firstDate: DateTime.now().subtract(const Duration(days: 365)),
                          lastDate: DateTime.now().add(const Duration(days: 1)),
                        );
                        if (date != null) {
                          setState(() {
                            _selectedDate = date;
                          });
                        }
                      },
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.grey),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.calendar_today, size: 20),
                            const SizedBox(width: 8),
                            Text(
                              DateFormat('MMM dd, yyyy').format(_selectedDate),
                              style: const TextStyle(fontSize: 16),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: InkWell(
                      onTap: () async {
                        final time = await showTimePicker(
                          context: context,
                          initialTime: _selectedTime,
                        );
                        if (time != null) {
                          setState(() {
                            _selectedTime = time;
                          });
                        }
                      },
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.grey),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.access_time, size: 20),
                            const SizedBox(width: 8),
                            Text(
                              _selectedTime.format(context),
                              style: const TextStyle(fontSize: 16),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _notesController,
                decoration: const InputDecoration(
                  labelText: 'Notes (Optional)',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.note),
                ),
                maxLines: 3,
              ),
            ],
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: _submit,
          child: Text(widget.log == null ? 'Add' : 'Update'),
        ),
      ],
    );
  }

  void _submit() {
    if (_formKey.currentState!.validate()) {
      final workoutDate = DateTime(
        _selectedDate.year,
        _selectedDate.month,
        _selectedDate.day,
        _selectedTime.hour,
        _selectedTime.minute,
      );

      final data = {
        'exercise_name': 'Workout',
        'exercise_type': _selectedExerciseType,
        'workout_time': workoutDate.toIso8601String(),
        'duration': _durationController.text.isEmpty ? null : int.tryParse(_durationController.text),
        'calories_burned': _caloriesController.text.isEmpty ? null : double.tryParse(_caloriesController.text),
        'notes': _notesController.text.isEmpty ? null : _notesController.text,
      };

      if (widget.log == null) {
        widget.controller.createWorkoutLog(data);
      } else {
        widget.controller.updateWorkoutLog(widget.log!.id, data);
      }

      Navigator.of(context).pop();
    }
  }

  @override
  void dispose() {
    _durationController.dispose();
    _caloriesController.dispose();
    _distanceController.dispose();
    _intensityController.dispose();
    _notesController.dispose();
    super.dispose();
  }
}
