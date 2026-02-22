import csv
import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from questions.models import Topic, Question, Option

User = get_user_model()

class Command(BaseCommand):
    help = 'Imports questions from a CSV file directly into the database'

    def add_arguments(self, parser):
        # We allow you to pass the file path as an argument
        parser.add_argument('csv_file', type=str, help='The path to the CSV file')

    def handle(self, *args, **kwargs):
        csv_file_path = kwargs['csv_file']
        
        # 1. Ensure your user exists
        user = User.objects.filter(email='georgebhokta@gmail.com').first()
        if not user:
            self.stdout.write(self.style.ERROR('User georgebhokta@gmail.com not found!'))
            return
            
        # 2. Ensure the CSV file exists
        if not os.path.exists(csv_file_path):
            self.stdout.write(self.style.ERROR(f'Could not find file at: "{csv_file_path}"'))
            return

        self.stdout.write("Reading CSV and importing questions...")

        # 3. Read the CSV and import
        with open(csv_file_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            count = 0
            
            for row in reader:
                # Get or Create the Topic
                topic, _ = Topic.objects.get_or_create(name=row['topic'].strip())
                
                # Create the Base Question
                question = Question.objects.create(
                    question_text=row['text'].strip(),
                    question_type=row['type'].strip().upper(),
                    difficulty=row['difficulty'].strip().upper(),
                    explanation=row['explanation'].strip(),
                    is_public=True,
                    created_by=user
                )
                
                # Assign the topic
                question.topics.add(topic)
                
                # Handle Options based on Question Type
                q_type = question.question_type
                if q_type == 'NAT':
                    # Extract the numerical answer
                    ans = row['numerical_answer'].strip()
                    if ans:
                        question.correct_numerical_answer = float(ans)
                        question.save()
                else:
                    # It's an MCQ or MSQ, let's pull the 4 options
                    for i in range(1, 5):
                        opt_text = row.get(f'opt{i}', '').strip()
                        opt_correct_str = row.get(f'opt{i}_correct', '').strip().lower()
                        is_correct = (opt_correct_str == 'true')
                        
                        if opt_text:
                            Option.objects.create(
                                question=question,
                                option_text=opt_text,
                                is_correct=is_correct
                            )
                count += 1
        
        self.stdout.write(self.style.SUCCESS(f'Boom! Successfully imported {count} real questions from the CSV!'))