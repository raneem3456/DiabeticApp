import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import '../../controllers/patient_controller.dart';
import '../../models/patient_models.dart';
import '../../themes/app_theme.dart';

class MoodsPage extends StatelessWidget {
  const MoodsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final patientController = Get.find<PatientController>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mood Tracking'),
        backgroundColor: AppTheme.primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () => _showFilterDialog(context, patientController),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => patientController.refreshMoods(),
        child: Obx(() {
          if (patientController.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (patientController.moods.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.sentiment_neutral,
                    size: 64,
                    color: Colors.grey[400],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No mood entries yet',
                    style: TextStyle(
                      fontSize: 18,
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Tap the + button to add your first mood',
                    style: TextStyle(
                      color: Colors.grey[500],
                    ),
                  ),
                ],
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: patientController.moods.length,
            itemBuilder: (context, index) {
              final mood = patientController.moods[index];
              return _buildMoodCard(context, mood, patientController);
            },
          );
        }),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddEditDialog(context, patientController),
        backgroundColor: AppTheme.primaryColor,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }

  Widget _buildMoodCard(BuildContext context, Mood mood, PatientController controller) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                _buildMoodIcon(mood.moodType),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        mood.moodType,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                                        Text(
                    DateFormat('MMM dd, yyyy - HH:mm').format(mood.moodTime),
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 14,
                    ),
                  ),
                    ],
                  ),
                ),
                PopupMenuButton<String>(
                  onSelected: (value) {
                    switch (value) {
                      case 'edit':
                        _showAddEditDialog(context, controller, mood: mood);
                        break;
                      case 'delete':
                        _showDeleteDialog(context, controller, mood.id);
                        break;
                    }
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
                          Icon(Icons.delete, size: 20, color: Colors.red),
                          SizedBox(width: 8),
                          Text('Delete', style: TextStyle(color: Colors.red)),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
            if (mood.notes?.isNotEmpty == true) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  mood.notes!,
                  style: const TextStyle(fontSize: 14),
                ),
              ),
            ],
            const SizedBox(height: 12),
            Row(
              children: [
                Icon(
                  Icons.trending_up,
                  size: 16,
                  color: Colors.orange,
                ),
                const SizedBox(width: 4),
                Text(
                  'Intensity: ${mood.intensity}/10',
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 12,
                  ),
                ),
                const Spacer(),
                Text(
                  'Logged at ${DateFormat('HH:mm').format(mood.moodTime)}',
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMoodIcon(String moodType) {
    IconData iconData;
    Color iconColor;

    switch (moodType.toLowerCase()) {
      case 'happy':
      case 'joyful':
      case 'excited':
        iconData = Icons.sentiment_very_satisfied;
        iconColor = Colors.green;
        break;
      case 'sad':
      case 'depressed':
      case 'melancholy':
        iconData = Icons.sentiment_very_dissatisfied;
        iconColor = Colors.blue;
        break;
      case 'angry':
      case 'frustrated':
      case 'irritated':
        iconData = Icons.sentiment_dissatisfied;
        iconColor = Colors.red;
        break;
      case 'anxious':
      case 'worried':
      case 'stressed':
        iconData = Icons.sentiment_neutral;
        iconColor = Colors.orange;
        break;
      case 'calm':
      case 'peaceful':
      case 'relaxed':
        iconData = Icons.sentiment_satisfied;
        iconColor = Colors.teal;
        break;
      default:
        iconData = Icons.sentiment_neutral;
        iconColor = Colors.grey;
    }

    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: iconColor.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Icon(iconData, color: iconColor, size: 24),
    );
  }

  void _showAddEditDialog(BuildContext context, PatientController controller, {Mood? mood}) {
    final isEditing = mood != null;
    final formKey = GlobalKey<FormState>();
    
    final moodTypeController = TextEditingController(text: mood?.moodType ?? '');
    final notesController = TextEditingController(text: mood?.notes ?? '');
    final intensityController = TextEditingController(
      text: mood?.intensity?.toString() ?? '5'
    );
    
    DateTime selectedDate = mood?.moodTime ?? DateTime.now();
    TimeOfDay selectedTime = TimeOfDay.fromDateTime(mood?.moodTime ?? DateTime.now());

    Get.dialog(
      AlertDialog(
        title: Text(isEditing ? 'Edit Mood' : 'Add New Mood'),
        content: SingleChildScrollView(
          child: Form(
            key: formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Mood Type
                TextFormField(
                  controller: moodTypeController,
                  decoration: const InputDecoration(
                    labelText: 'Mood Type *',
                    hintText: 'e.g., Happy, Sad, Anxious',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Please enter a mood type';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                // Date and Time
                Row(
                  children: [
                    Expanded(
                      child: InkWell(
                        onTap: () async {
                          final date = await showDatePicker(
                            context: context,
                            initialDate: selectedDate,
                            firstDate: DateTime.now().subtract(const Duration(days: 365)),
                            lastDate: DateTime.now(),
                          );
                          if (date != null) {
                            selectedDate = DateTime(
                              date.year,
                              date.month,
                              date.day,
                              selectedTime.hour,
                              selectedTime.minute,
                            );
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
                                DateFormat('MMM dd, yyyy').format(selectedDate),
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
                            initialTime: selectedTime,
                          );
                          if (time != null) {
                            selectedTime = time;
                            selectedDate = DateTime(
                              selectedDate.year,
                              selectedDate.month,
                              selectedDate.day,
                              time.hour,
                              time.minute,
                            );
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
                                selectedTime.format(context),
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

                // Notes
                TextFormField(
                  controller: notesController,
                  decoration: const InputDecoration(
                    labelText: 'Notes',
                    hintText: 'How are you feeling? Any specific thoughts?',
                    border: OutlineInputBorder(),
                  ),
                  maxLines: 3,
                ),
                const SizedBox(height: 16),

                // Intensity
                TextFormField(
                  controller: intensityController,
                  decoration: const InputDecoration(
                    labelText: 'Intensity (1-10)',
                    hintText: 'Rate your mood intensity',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.trending_up),
                  ),
                  keyboardType: TextInputType.number,
                  validator: (value) {
                    if (value != null && value.isNotEmpty) {
                      final intensity = int.tryParse(value);
                      if (intensity == null || intensity < 1 || intensity > 10) {
                        return 'Please enter a number between 1 and 10';
                      }
                    }
                    return null;
                  },
                ),
              ],
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              if (formKey.currentState!.validate()) {
                final data = {
                  'mood_type': moodTypeController.text.trim(),
                  'mood_time': selectedDate.toIso8601String(),
                  'notes': notesController.text.trim(),
                  'intensity': int.parse(intensityController.text),
                };

                try {
                  if (isEditing) {
                    await controller.updateMood(mood!.id, data);
                  } else {
                    await controller.createMood(data);
                  }
                  Get.back();
                  Get.snackbar(
                    'Success',
                    isEditing ? 'Mood updated successfully' : 'Mood added successfully',
                    backgroundColor: Colors.green,
                    colorText: Colors.white,
                  );
                } catch (e) {
                  Get.snackbar(
                    'Error',
                    'Failed to ${isEditing ? 'update' : 'add'} mood: $e',
                    backgroundColor: Colors.red,
                    colorText: Colors.white,
                  );
                }
              }
            },
            child: Text(isEditing ? 'Update' : 'Add'),
          ),
        ],
      ),
    );
  }

  void _showDeleteDialog(BuildContext context, PatientController controller, int moodId) {
    Get.dialog(
      AlertDialog(
        title: const Text('Delete Mood'),
        content: const Text('Are you sure you want to delete this mood entry? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              try {
                await controller.deleteMood(moodId);
                Get.back();
                Get.snackbar(
                  'Success',
                  'Mood deleted successfully',
                  backgroundColor: Colors.green,
                  colorText: Colors.white,
                );
              } catch (e) {
                Get.snackbar(
                  'Error',
                  'Failed to delete mood: $e',
                  backgroundColor: Colors.red,
                  colorText: Colors.white,
                );
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Delete', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _showFilterDialog(BuildContext context, PatientController controller) {
    final moodTypeController = TextEditingController(text: controller.moodTypeFilter ?? '');
    DateTimeRange? selectedDateRange = controller.dateRangeFilter;

    Get.dialog(
      AlertDialog(
        title: const Text('Filter Moods'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextFormField(
              controller: moodTypeController,
              decoration: const InputDecoration(
                labelText: 'Mood Type',
                hintText: 'Filter by mood type',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            InkWell(
              onTap: () async {
                final range = await showDateRangePicker(
                  context: context,
                  firstDate: DateTime.now().subtract(const Duration(days: 365)),
                  lastDate: DateTime.now(),
                  initialDateRange: selectedDateRange,
                );
                if (range != null) {
                  selectedDateRange = range;
                }
              },
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.date_range, size: 20),
                    const SizedBox(width: 8),
                    Text(
                      selectedDateRange != null
                          ? '${DateFormat('MMM dd').format(selectedDateRange!.start)} - ${DateFormat('MMM dd').format(selectedDateRange!.end)}'
                          : 'Select date range',
                      style: const TextStyle(fontSize: 16),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              controller.clearAllFilters();
              Get.back();
            },
            child: const Text('Clear All'),
          ),
          TextButton(
            onPressed: () => Get.back(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              controller.setMoodTypeFilter(moodTypeController.text.isNotEmpty ? moodTypeController.text : null);
              controller.setDateRangeFilter(selectedDateRange);
              controller.applyMoodFilters();
              Get.back();
            },
            child: const Text('Apply'),
          ),
        ],
      ),
    );
  }
}
