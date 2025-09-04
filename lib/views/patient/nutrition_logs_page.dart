import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import '../../controllers/patient_controller.dart';
import '../../models/patient_models.dart';
import '../../themes/app_theme.dart';
import '../../utils/app_constants.dart';

class NutritionLogsPage extends StatelessWidget {
  const NutritionLogsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.find<PatientController>();
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Nutrition Logs'),
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
        
        if (controller.nutritionLogs.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.restaurant_outlined,
                  size: 64,
                  color: Colors.grey[400],
                ),
                const SizedBox(height: 16),
                Text(
                  'No nutrition logs yet',
                  style: TextStyle(
                    fontSize: 18,
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Track your meals and nutrition intake',
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
          itemCount: controller.nutritionLogs.length,
          itemBuilder: (context, index) {
            final log = controller.nutritionLogs[index];
            return _NutritionLogCard(
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
      builder: (context) => _NutritionLogDialog(
        controller: controller,
        log: null,
      ),
    );
  }

  void _showEditDialog(BuildContext context, PatientController controller, NutritionLog log) {
    showDialog(
      context: context,
      builder: (context) => _NutritionLogDialog(
        controller: controller,
        log: log,
      ),
    );
  }

  void _showDeleteDialog(BuildContext context, PatientController controller, NutritionLog log) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Nutrition Log'),
        content: Text('Are you sure you want to delete this nutrition log?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              controller.deleteNutritionLog(log.id);
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
        title: const Text('Filter Nutrition Logs'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(
                labelText: 'Meal Type',
                border: OutlineInputBorder(),
              ),
              value: controller.mealTypeFilter,
              items: [
                const DropdownMenuItem(value: null, child: Text('All Meals')),
                ...AppConstants.mealTypes.map((type) => DropdownMenuItem(
                  value: type,
                  child: Text(type),
                )),
              ],
              onChanged: (value) => controller.setMealTypeFilter(value),
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
              controller.applyNutritionFilters();
              Navigator.of(context).pop();
            },
            child: const Text('Apply'),
          ),
        ],
      ),
    );
  }
}

class _NutritionLogCard extends StatelessWidget {
  final NutritionLog log;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const _NutritionLogCard({
    required this.log,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final mealColor = _getMealColor(log.mealType);

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
                    color: mealColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    _getMealIcon(log.mealType),
                    color: mealColor,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        log.foodName,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        log.mealType,
                        style: TextStyle(
                          color: mealColor,
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
                  label: DateFormat('MMM dd, yyyy').format(log.mealTime),
                ),
                const SizedBox(width: 8),
                _InfoChip(
                  icon: Icons.schedule,
                  label: DateFormat('HH:mm').format(log.mealTime),
                ),
              ],
            ),
            const SizedBox(height: 12),
            _NutritionInfoRow(
              calories: log.calories,
              carbs: log.carbs,
              protein: log.protein,
              fat: log.fat,
              fiber: log.fiber,
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

  Color _getMealColor(String mealType) {
    switch (mealType.toLowerCase()) {
      case 'breakfast':
        return Colors.orange;
      case 'lunch':
        return Colors.green;
      case 'dinner':
        return Colors.purple;
      case 'snack':
        return Colors.blue;
      default:
        return AppTheme.primaryColor;
    }
  }

  IconData _getMealIcon(String mealType) {
    switch (mealType.toLowerCase()) {
      case 'breakfast':
        return Icons.wb_sunny;
      case 'lunch':
        return Icons.restaurant;
      case 'dinner':
        return Icons.dinner_dining;
      case 'snack':
        return Icons.cake;
      default:
        return Icons.restaurant;
    }
  }
}

class _NutritionInfoRow extends StatelessWidget {
  final double? calories;
  final double? carbs;
  final double? protein;
  final double? fat;
  final double? fiber;

  const _NutritionInfoRow({
    this.calories,
    this.carbs,
    this.protein,
    this.fat,
    this.fiber,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        if (calories != null)
          _NutritionChip(
            label: 'Calories',
            value: '${calories!.toStringAsFixed(0)}',
            color: Colors.orange,
          ),
        if (carbs != null)
          _NutritionChip(
            label: 'Carbs',
            value: '${carbs!.toStringAsFixed(1)}g',
            color: Colors.green,
          ),
        if (protein != null)
          _NutritionChip(
            label: 'Protein',
            value: '${protein!.toStringAsFixed(1)}g',
            color: Colors.blue,
          ),
        if (fat != null)
          _NutritionChip(
            label: 'Fat',
            value: '${fat!.toStringAsFixed(1)}g',
            color: Colors.red,
          ),
        if (fiber != null)
          _NutritionChip(
            label: 'Fiber',
            value: '${fiber!.toStringAsFixed(1)}g',
            color: Colors.brown,
          ),
      ],
    );
  }
}

class _NutritionChip extends StatelessWidget {
  final String label;
  final String value;
  final Color color;

  const _NutritionChip({
    required this.label,
    required this.value,
    required this.color,
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
      child: Column(
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

class _NutritionLogDialog extends StatefulWidget {
  final PatientController controller;
  final NutritionLog? log;

  const _NutritionLogDialog({
    required this.controller,
    this.log,
  });

  @override
  State<_NutritionLogDialog> createState() => _NutritionLogDialogState();
}

class _NutritionLogDialogState extends State<_NutritionLogDialog> {
  final _formKey = GlobalKey<FormState>();
  final _foodNameController = TextEditingController();
  final _caloriesController = TextEditingController();
  final _carbsController = TextEditingController();
  final _proteinController = TextEditingController();
  final _fatController = TextEditingController();
  final _fiberController = TextEditingController();
  final _notesController = TextEditingController();
  String _selectedMealType = AppConstants.mealTypes.first;
  DateTime _selectedDate = DateTime.now();
  TimeOfDay _selectedTime = TimeOfDay.now();

  @override
  void initState() {
    super.initState();
    if (widget.log != null) {
      _foodNameController.text = widget.log!.foodName;
      _selectedMealType = widget.log!.mealType;
      _caloriesController.text = widget.log!.calories?.toString() ?? '';
      _carbsController.text = widget.log!.carbs?.toString() ?? '';
      _proteinController.text = widget.log!.protein?.toString() ?? '';
      _fatController.text = widget.log!.fat?.toString() ?? '';
      _fiberController.text = widget.log!.fiber?.toString() ?? '';
      _notesController.text = widget.log!.notes ?? '';
      _selectedDate = widget.log!.mealTime;
      _selectedTime = TimeOfDay.fromDateTime(widget.log!.mealTime);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(widget.log == null ? 'Add Nutrition Log' : 'Edit Nutrition Log'),
      content: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                controller: _foodNameController,
                decoration: const InputDecoration(
                  labelText: 'Food Name',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.restaurant),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter food name';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _selectedMealType,
                decoration: const InputDecoration(
                  labelText: 'Meal Type',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.category),
                ),
                items: AppConstants.mealTypes.map((type) {
                  return DropdownMenuItem(
                    value: type,
                    child: Text(type),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedMealType = value!;
                  });
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please select meal type';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              Row(
                children: [
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
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      controller: _carbsController,
                      decoration: const InputDecoration(
                        labelText: 'Carbs (g)',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.grain),
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
                      controller: _proteinController,
                      decoration: const InputDecoration(
                        labelText: 'Protein (g)',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.fitness_center),
                      ),
                      keyboardType: TextInputType.number,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      controller: _fatController,
                      decoration: const InputDecoration(
                        labelText: 'Fat (g)',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.opacity),
                      ),
                      keyboardType: TextInputType.number,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _fiberController,
                decoration: const InputDecoration(
                  labelText: 'Fiber (g)',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.eco),
                ),
                keyboardType: TextInputType.number,
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
      final mealTime = DateTime(
        _selectedDate.year,
        _selectedDate.month,
        _selectedDate.day,
        _selectedTime.hour,
        _selectedTime.minute,
      );

      final data = {
        'food_name': _foodNameController.text,
        'meal_type': _selectedMealType,
        'meal_time': mealTime.toIso8601String(),
        'calories': _caloriesController.text.isEmpty ? null : double.tryParse(_caloriesController.text),
        'carbs': _carbsController.text.isEmpty ? null : double.tryParse(_carbsController.text),
        'protein': _proteinController.text.isEmpty ? null : double.tryParse(_proteinController.text),
        'fat': _fatController.text.isEmpty ? null : double.tryParse(_fatController.text),
        'fiber': _fiberController.text.isEmpty ? null : double.tryParse(_fiberController.text),
        'notes': _notesController.text.isEmpty ? null : _notesController.text,
      };

      if (widget.log == null) {
        widget.controller.createNutritionLog(data);
      } else {
        widget.controller.updateNutritionLog(widget.log!.id, data);
      }

      Navigator.of(context).pop();
    }
  }

  @override
  void dispose() {
    _foodNameController.dispose();
    _caloriesController.dispose();
    _carbsController.dispose();
    _proteinController.dispose();
    _fatController.dispose();
    _fiberController.dispose();
    _notesController.dispose();
    super.dispose();
  }
}
