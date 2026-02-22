import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from questions.models import Topic, Question, Option

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with dummy questions'

    def add_arguments(self, parser):
        # Allow the user to specify how many questions to create
        parser.add_argument('--amount', type=int, default=50, help='Number of questions to create')

    def handle(self, *args, **kwargs):
        amount = kwargs['amount']

        # 1. Get or create a User
        user, created = User.objects.get_or_create(
            email='georgebhokta@gmail.com', 
            defaults={'username': 'george_demo', 'password': 'password123'}
        )

        # 2. Create some demo Topics
        topic_names = ['Python', 'Django', 'JavaScript', 'React', 'Data Science', 'DevOps']
        topic_objs = []
        for name in topic_names:
            topic, _ = Topic.objects.get_or_create(name=name)
            topic_objs.append(topic)

        # 3. Generate Questions
        self.stdout.write(f"Generating {amount} questions... Please wait.")
        
        for i in range(amount):
            q_type = random.choice(['MCQ', 'MSQ', 'NAT'])
            difficulty = random.choice(['EASY', 'MEDIUM', 'HARD'])

            # Create the base question
            question = Question.objects.create(
                question_text=f"Sample {q_type} Question #{i+1}: What is the correct answer?",
                question_type=q_type,
                difficulty=difficulty,
                explanation=f"This is an automated explanation for Question #{i+1}.",
                is_public=True,
                created_by=user
            )

            # Assign 1 to 3 random topics to this question
            assigned_topics = random.sample(topic_objs, random.randint(1, 3))
            question.topics.set(assigned_topics)

            # 4. Handle Options / Answers based on Question Type
            if q_type == 'NAT':
                # Numerical questions just need a correct number, no options
                question.correct_numerical_answer = round(random.uniform(1.0, 100.0), 2)
                question.save()
            
            elif q_type == 'MCQ':
                # Multiple choice: Only 1 correct option
                correct_index = random.randint(0, 3)
                for j in range(4):
                    Option.objects.create(
                        question=question,
                        option_text=f"Option {j+1} for Q{i+1}",
                        is_correct=(j == correct_index)
                    )
            
            elif q_type == 'MSQ':
                # Multiple select: 1 to 4 correct options
                for j in range(4):
                    Option.objects.create(
                        question=question,
                        option_text=f"Option {j+1} for Q{i+1}",
                        is_correct=random.choice([True, False])
                    )
                # Fallback: ensure at least ONE is true for MSQ
                if not question.options.filter(is_correct=True).exists():
                    first_opt = question.options.first()
                    first_opt.is_correct = True
                    first_opt.save()

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {amount} questions!'))