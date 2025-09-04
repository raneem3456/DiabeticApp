import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';
import '../../controllers/patient_controller.dart';
import '../../models/patient_models.dart';
import '../../themes/app_theme.dart';
import '../../utils/app_constants.dart';

class GlucoseReadingsPage extends StatelessWidget {
  const GlucoseReadingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(PatientController());
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Glucose Readings'),
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
        
        if (controller.glucoseReadings.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.monitor_heart_outlined,
                  size: 64,
                  color: Colors.grey[400],
                ),
                const SizedBox(height: 16),
                Text(
                  'No glucose readings yet',
                  style: TextStyle(
                    fontSize: 18,
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Add your first reading to start tracking',
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
          itemCount: controller.glucoseReadings.length,
          itemBuilder: (context, index) {
            final reading = controller.glucoseReadings[index];
            return _GlucoseReadingCard(
              reading: reading,
              onEdit: () => _showEditDialog(context, controller, reading),
              onDelete: () => _showDeleteDialog(context, controller, reading),
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
      builder: (context) => _GlucoseReadingDialog(
        controller: controller,
        reading: null,
      ),
    );
  }

  void _showEditDialog(BuildContext context, PatientController controller, GlucoseReading reading) {
    showDialog(
      context: context,
      builder: (context) => _GlucoseReadingDialog(
        controller: controller,
        reading: reading,
      ),
    );
  }

  void _showDeleteDialog(BuildContext context, PatientController controller, GlucoseReading reading) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Reading'),
        content: Text('Are you sure you want to delete this glucose reading?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              controller.deleteGlucoseReading(reading.id);
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
        title: const Text('Filter Readings'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              decoration: const InputDecoration(
                labelText: 'Min Value (mg/dL)',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
              onChanged: (value) => controller.setMinGlucoseFilter(value),
            ),
            const SizedBox(height: 16),
            TextField(
              decoration: const InputDecoration(
                labelText: 'Max Value (mg/dL)',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
              onChanged: (value) => controller.setMaxGlucoseFilter(value),
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
              controller.applyGlucoseFilters();
              Navigator.of(context).pop();
            },
            child: const Text('Apply'),
          ),
        ],
      ),
    );
  }
}

class _GlucoseReadingCard extends StatelessWidget {
  final GlucoseReading reading;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const _GlucoseReadingCard({
    required this.reading,
    required this.onEdit,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final isHigh = reading.value > 180;
    final isLow = reading.value < 70;
    final isNormal = !isHigh && !isLow;
    
    Color statusColor;
    IconData statusIcon;
    
    if (isHigh) {
      statusColor = AppTheme.errorColor;
      statusIcon = Icons.trending_up;
    } else if (isLow) {
      statusColor = AppTheme.warningColor;
      statusIcon = Icons.trending_down;
    } else {
      statusColor = AppTheme.successColor;
      statusIcon = Icons.check_circle;
    }

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
                    color: statusColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    statusIcon,
                    color: statusColor,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${reading.value} mg/dL',
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        _getStatusText(isHigh, isLow, isNormal),
                        style: TextStyle(
                          color: statusColor,
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
                  label: DateFormat('MMM dd, yyyy').format(reading.readingDate),
                ),
                const SizedBox(width: 8),
                _InfoChip(
                  icon: Icons.schedule,
                  label: DateFormat('HH:mm').format(reading.readingDate),
                ),
                const SizedBox(width: 8),
                _InfoChip(
                  icon: Icons.category,
                  label: reading.source ?? 'Unknown',
                ),
              ],
            ),
            if (reading.notes?.isNotEmpty == true) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  reading.notes!,
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

  String _getStatusText(bool isHigh, bool isLow, bool isNormal) {
    if (isHigh) return 'High';
    if (isLow) return 'Low';
    return 'Normal';
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

class _GlucoseReadingDialog extends StatefulWidget {
  final PatientController controller;
  final GlucoseReading? reading;

  const _GlucoseReadingDialog({
    required this.controller,
    this.reading,
  });

  @override
  State<_GlucoseReadingDialog> createState() => _GlucoseReadingDialogState();
}

class _GlucoseReadingDialogState extends State<_GlucoseReadingDialog> {
  final _formKey = GlobalKey<FormState>();
  final _valueController = TextEditingController();
  final _notesController = TextEditingController();
  DateTime _selectedDate = DateTime.now();
  TimeOfDay _selectedTime = TimeOfDay.now();
  String _selectedSource = AppConstants.glucoseSources.first;

  @override
  void initState() {
    super.initState();
    if (widget.reading != null) {
      _valueController.text = widget.reading!.value.toString();
      _notesController.text = widget.reading!.notes ?? '';
      _selectedDate = widget.reading!.readingDate;
      _selectedTime = TimeOfDay.fromDateTime(widget.reading!.readingDate);
      _selectedSource = widget.reading!.source ?? AppConstants.glucoseSources.first;
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(widget.reading == null ? 'Add Reading' : 'Edit Reading'),
      content: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextFormField(
                controller: _valueController,
                decoration: const InputDecoration(
                  labelText: 'Glucose Value (mg/dL)',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.monitor_heart),
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter glucose value';
                  }
                  final num = double.tryParse(value);
                  if (num == null || num <= 0) {
                    return 'Please enter a valid number';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _selectedSource,
                decoration: const InputDecoration(
                  labelText: 'Source',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.category),
                ),
                items: AppConstants.glucoseSources.map((source) {
                  return DropdownMenuItem(
                    value: source,
                    child: Text(source),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedSource = value!;
                  });
                },
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
          child: Text(widget.reading == null ? 'Add' : 'Update'),
        ),
      ],
    );
  }

  void _submit() {
    if (_formKey.currentState!.validate()) {
      final readingDate = DateTime(
        _selectedDate.year,
        _selectedDate.month,
        _selectedDate.day,
        _selectedTime.hour,
        _selectedTime.minute,
      );

      final data = {
        'value': double.parse(_valueController.text),
        'reading_date': readingDate.toIso8601String(),
        'source': _selectedSource,
        'notes': _notesController.text.isEmpty ? null : _notesController.text,
      };

      if (widget.reading == null) {
        widget.controller.createGlucoseReading(data);
      } else {
        widget.controller.updateGlucoseReading(widget.reading!.id, data);
      }

      Navigator.of(context).pop();
    }
  }

  @override
  void dispose() {
    _valueController.dispose();
    _notesController.dispose();
    super.dispose();
  }
}
