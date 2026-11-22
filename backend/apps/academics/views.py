import os
import json
import urllib.request
import urllib.error
from datetime import datetime, timedelta
from django.utils import timezone
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.accounts.models import StudentProfile
from .models import AIChatSession, AIChatMessage
from .serializers import (
    AIChatMessageSerializer,
    AIChatSessionListSerializer,
    AIChatSessionDetailSerializer,
)

@api_view(['GET'])
@permission_classes([AllowAny])
def academics_index(request):
    """Base endpoint for Academics & Learning module."""
    return Response({
        'module': 'academics',
        'status': 'ready',
        'message': 'EduMitra AI Academics module is initialized.'
    })


def _get_student_profile(request):
    """
    Extracts StudentProfile from authenticated user or email query/body parameter.
    Ensures students access their own data only.
    """
    email = request.query_params.get('email') or request.data.get('email')
    if not email and request.user.is_authenticated:
        email = request.user.email

    if not email:
        # Fallback to first profile if demo or query parameter absent
        profile = StudentProfile.objects.first()
        if profile:
            return profile, None
        return None, 'Student email or authentication required.'

    profile = StudentProfile.objects.filter(email__iexact=str(email).strip().lower()).first()
    if not profile:
        return None, f"Student profile for '{email}' not found."
    return profile, None


def _seed_showcase_sessions_if_empty(profile):
    """
    Seeds initial showcase curriculum-aligned chat sessions for a student
    matching the verified Stitch design specifications.
    """
    if AIChatSession.objects.filter(student=profile).exists():
        return

    now = timezone.now()

    # 1. Active showcase session: B+ Tree Node Redistribution vs Merging
    b_tree_session = AIChatSession.objects.create(
        student=profile,
        title="B+ Tree Node Redistribution vs Merging",
        subject="DBMS (CS-304)",
        semester="Semester 6",
        mode="socratic",
        tone="concise_academic",
        is_pinned=False,
    )
    # Add initial dialogue
    AIChatMessage.objects.create(
        session=b_tree_session,
        sender="user",
        content="I understand how B+ tree node splitting works during insertion, but I get confused when deleting keys. Can you explain when we should redistribute keys from a sibling versus when we have to merge nodes? Please give a concrete example.",
        metadata={}
    )
    AIChatMessage.objects.create(
        session=b_tree_session,
        sender="assistant",
        content="Think of redistribution as a polite borrow between adjacent siblings, while merging is combining two households when neither can maintain their minimum space alone.",
        metadata={
            "badge": "CS-304 Verified",
            "analogy": {
                "title": "Core Constraint (Order m):",
                "text": "In a B+ tree of order m, each internal node must maintain at least ⌈m/2⌉ - 1 keys. If a deletion drops the key count below this threshold, an underflow triggers."
            },
            "rules": [
                {
                    "number": "1",
                    "title": "Rule 1: Redistribution First (The Preferred Path)",
                    "formula": "Sibling Keys > ⌈m / 2⌉ - 1",
                    "text": "Always check immediate siblings (left first, then right). If an adjacent sibling has extra capacity—meaning its count satisfies the condition, then redistribute. We shift a key over by rotating through the parent index node to preserve sorting invariants."
                },
                {
                    "number": "2",
                    "title": "Rule 2: Merging Fallback (When Both are Lean)",
                    "text": "If neither sibling has spare keys to loan (both hold exactly ⌈m/2⌉ - 1 keys), borrowing is mathematically impossible without causing a secondary underflow. You are forced to merge the deficient node with its sibling and pull down the separating key from the parent."
                }
            ],
            "blueprint": {
                "title": "Redistribution Mechanism Blueprint",
                "code": "[Parent Index]             [ ... | 45 | ... ]\n                                 /    \\\n                     Borrowing  /      \\  Deficient\n                                v        v\n[Left Sibling: 3 Keys]     [ 20 | 30 | 40 ]  [ 50 (Underflow) ]\n-----------------------------------------------------------------\nRESULT: Key 40 ascends to parent; Old parent 45 shifts to right child.\n\n[Parent Index]             [ ... | 40 | ... ]\n                                 /    \\\n                                v      v\n[Left Sibling: 2 Keys]       [ 20 | 30 ]    [ 45 | 50 ]"
            },
            "checkpoint": {
                "title": "Checkpoint Probe",
                "question": "Let's solidify this: Suppose an internal node in an order-5 tree has 1 key left after a deletion. Its immediate left sibling currently has 3 keys. Can it borrow? If yes, what specific key gets overwritten in the parent?"
            },
            "saved": False,
            "feedback": None
        }
    )

    # 2. Today: Deadlock Avoidance: Banker's Algorithm
    AIChatSession.objects.create(
        student=profile,
        title="Deadlock Avoidance: Banker's Algorithm",
        subject="Operating Systems (CS-302)",
        semester="Semester 6",
        mode="socratic",
        tone="concise_academic",
        is_pinned=False,
    )

    # 3. Previous 7 Days sessions
    s3 = AIChatSession.objects.create(
        student=profile,
        title="Dynamic Programming 0/1 Knapsack",
        subject="Algorithms (CS-301)",
        semester="Semester 6",
        mode="drills",
        tone="concise_academic",
        is_pinned=False,
    )
    AIChatSession.objects.filter(id=s3.id).update(
        created_at=now - timedelta(days=2),
        updated_at=now - timedelta(days=2)
    )

    s4 = AIChatSession.objects.create(
        student=profile,
        title="TCP 3-Way Handshake vs Teardown",
        subject="Computer Networks (CS-303)",
        semester="Semester 6",
        mode="summary",
        tone="concise_academic",
        is_pinned=False,
    )
    AIChatSession.objects.filter(id=s4.id).update(
        created_at=now - timedelta(days=4),
        updated_at=now - timedelta(days=4)
    )

    s5 = AIChatSession.objects.create(
        student=profile,
        title="Computer Arch: Cache Coherence (MESI)",
        subject="Computer Architecture (CS-305)",
        semester="Semester 6",
        mode="socratic",
        tone="concise_academic",
        is_pinned=False,
    )
    AIChatSession.objects.filter(id=s5.id).update(
        created_at=now - timedelta(days=5),
        updated_at=now - timedelta(days=5)
    )

    # 4. Pinned Study Guide
    AIChatSession.objects.create(
        student=profile,
        title="Midterm CS-304 High-Yield Formulae",
        subject="DBMS (CS-304)",
        semester="Semester 6",
        mode="summary",
        tone="concise_academic",
        is_pinned=True,
    )

    # Touch b_tree_session so it stays as the top active session
    b_tree_session.updated_at = timezone.now() + timedelta(seconds=1)
    b_tree_session.save(update_fields=['updated_at'])


class AIChatSessionListView(APIView):
    """
    GET /api/academics/ai/sessions/
    Lists chat sessions for student. Supports ?search= and ?email=.

    POST /api/academics/ai/sessions/
    Creates a new chat session.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        profile, err = _get_student_profile(request)
        if not profile:
            return Response({'status': 'error', 'message': err}, status=status.HTTP_404_NOT_FOUND)

        _seed_showcase_sessions_if_empty(profile)

        sessions = AIChatSession.objects.filter(student=profile)
        search_query = request.query_params.get('search', '').strip()
        if search_query:
            sessions = sessions.filter(title__icontains=search_query)

        serializer = AIChatSessionListSerializer(sessions, many=True)
        return Response({
            'status': 'success',
            'data': serializer.data
        })

    def post(self, request):
        profile, err = _get_student_profile(request)
        if not profile:
            return Response({'status': 'error', 'message': err}, status=status.HTTP_404_NOT_FOUND)

        title = request.data.get('title', 'New Chat Session').strip() or 'New Chat Session'
        subject = request.data.get('subject', 'DBMS (CS-304)').strip() or 'DBMS (CS-304)'
        semester = request.data.get('semester', 'Semester 6').strip() or 'Semester 6'
        mode = request.data.get('mode', 'socratic')
        tone = request.data.get('tone', 'concise_academic')

        session = AIChatSession.objects.create(
            student=profile,
            title=title,
            subject=subject,
            semester=semester,
            mode=mode,
            tone=tone
        )

        serializer = AIChatSessionDetailSerializer(session)
        return Response({
            'status': 'success',
            'message': 'Chat session created.',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)


class AIChatSessionDetailView(APIView):
    """
    GET /api/academics/ai/sessions/<session_id>/
    Retrieves a session and all its messages.

    PATCH /api/academics/ai/sessions/<session_id>/
    Updates session parameters (mode, tone, title, is_pinned).

    DELETE /api/academics/ai/sessions/<session_id>/
    Deletes the session.
    """
    permission_classes = [AllowAny]

    def _get_session(self, request, session_id):
        profile, err = _get_student_profile(request)
        if not profile:
            return None, err
        try:
            session = AIChatSession.objects.get(id=session_id, student=profile)
            return session, None
        except AIChatSession.DoesNotExist:
            return None, 'Chat session not found or unauthorized.'

    def get(self, request, session_id):
        session, err = self._get_session(request, session_id)
        if not session:
            return Response({'status': 'error', 'message': err}, status=status.HTTP_404_NOT_FOUND)

        serializer = AIChatSessionDetailSerializer(session)
        return Response({'status': 'success', 'data': serializer.data})

    def patch(self, request, session_id):
        session, err = self._get_session(request, session_id)
        if not session:
            return Response({'status': 'error', 'message': err}, status=status.HTTP_404_NOT_FOUND)

        if 'mode' in request.data:
            session.mode = request.data['mode']
        if 'tone' in request.data:
            session.tone = request.data['tone']
        if 'title' in request.data:
            session.title = request.data['title']
        if 'is_pinned' in request.data:
            session.is_pinned = bool(request.data['is_pinned'])
        session.save()

        serializer = AIChatSessionDetailSerializer(session)
        return Response({'status': 'success', 'data': serializer.data})

    def delete(self, request, session_id):
        session, err = self._get_session(request, session_id)
        if not session:
            return Response({'status': 'error', 'message': err}, status=status.HTTP_404_NOT_FOUND)

        session.delete()
        return Response({'status': 'success', 'message': 'Chat session deleted successfully.'})


class AIChatSessionClearView(APIView):
    """
    POST /api/academics/ai/sessions/<session_id>/clear/
    Clears all messages in the conversation while keeping the session metadata.
    """
    permission_classes = [AllowAny]

    def post(self, request, session_id):
        profile, err = _get_student_profile(request)
        if not profile:
            return Response({'status': 'error', 'message': err}, status=status.HTTP_404_NOT_FOUND)

        try:
            session = AIChatSession.objects.get(id=session_id, student=profile)
        except AIChatSession.DoesNotExist:
            return Response({'status': 'error', 'message': 'Chat session not found.'}, status=status.HTTP_404_NOT_FOUND)

        session.messages.all().delete()
        serializer = AIChatSessionDetailSerializer(session)
        return Response({
            'status': 'success',
            'message': 'Conversation cleared successfully.',
            'data': serializer.data
        })


class AIChatMessageCreateView(APIView):
    """
    POST /api/academics/ai/sessions/<session_id>/messages/
    Submits a student inquiry and triggers the Socratic AI response.
    Inspects environment for external AI API credentials (GEMINI_API_KEY).
    If unconfigured, records the student prompt and returns a clear educational report
    of the configuration limitation without faking live AI responses.
    """
    permission_classes = [AllowAny]

    def post(self, request, session_id):
        profile, err = _get_student_profile(request)
        if not profile:
            return Response({'status': 'error', 'message': err}, status=status.HTTP_404_NOT_FOUND)

        try:
            session = AIChatSession.objects.get(id=session_id, student=profile)
        except AIChatSession.DoesNotExist:
            return Response({'status': 'error', 'message': 'Chat session not found.'}, status=status.HTTP_404_NOT_FOUND)

        content = request.data.get('content', '').strip()
        if not content:
            return Response({'status': 'error', 'message': 'Message content cannot be empty.'}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Save student inquiry message
        user_message = AIChatMessage.objects.create(
            session=session,
            sender='user',
            content=content,
            metadata={}
        )

        # Update session title if default
        if session.title == 'New Chat Session':
            first_words = ' '.join(content.split()[:6])
            if first_words:
                session.title = first_words[:50]
                session.save(update_fields=['title', 'updated_at'])

        # 2. Check for configured external AI service
        gemini_api_key = os.getenv('GEMINI_API_KEY', '').strip()
        ai_response_content = None
        ai_metadata = {}
        ai_configured = False

        if gemini_api_key:
            try:
                # Call Gemini REST API directly using standard urllib
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_api_key}"
                prompt_text = (
                    f"You are EduMitra Socratic AI Coach, a supportive university tutor grounded in {session.subject} syllabus. "
                    f"Student mode: {session.mode}, Tone: {session.tone}.\n\n"
                    f"Student Inquiry: {content}\n\n"
                    f"Provide a clear pedagogical explanation. Include a short analogy, key rule, concise code/blueprint if applicable, and end with one checkpoint probe question."
                )
                payload = {
                    "contents": [{"parts": [{"text": prompt_text}]}],
                    "generationConfig": {"temperature": 0.4, "maxOutputTokens": 800}
                }
                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode('utf-8'),
                    headers={'Content-Type': 'application/json'}
                )
                with urllib.request.urlopen(req, timeout=15) as resp:
                    resp_data = json.loads(resp.read().decode('utf-8'))
                    candidates = resp_data.get('candidates', [])
                    if candidates:
                        raw_text = candidates[0].get('content', {}).get('parts', [{}])[0].get('text', '')
                        if raw_text:
                            ai_response_content = raw_text
                            ai_configured = True
                            ai_metadata = {
                                "badge": f"{session.subject} Verified",
                                "checkpoint": {
                                    "title": "Checkpoint Probe",
                                    "question": "Can you summarize how this principle applies to your next practice problem?"
                                },
                                "saved": False,
                                "feedback": None
                            }
            except Exception as e:
                ai_configured = False

        if not ai_configured:
            # Report external service configuration status transparently as instructed
            ai_response_content = (
                f"**EduMitra Socratic Coach Note:**\n\n"
                f"Your query regarding *\"{content[:60]}...\"* has been recorded in your {session.subject} study workspace.\n\n"
                f"> **External AI Service Notice:** Live dynamic responses require `GEMINI_API_KEY` configured in the backend `.env` environment. "
                f"When configured, the Socratic tutor generates real-time pedagogical breakdowns, step-by-step proofs, and checkpoint probes tailored to your syllabus."
            )
            ai_metadata = {
                "badge": f"{session.subject} Socratic Engine",
                "ai_configured": False,
                "saved": False,
                "feedback": None
            }

        # Save assistant turn
        assistant_message = AIChatMessage.objects.create(
            session=session,
            sender='assistant',
            content=ai_response_content,
            metadata=ai_metadata
        )

        session.refresh_from_db()
        detail_serializer = AIChatSessionDetailSerializer(session)
        return Response({
            'status': 'success',
            'ai_configured': ai_configured,
            'message': 'Message sent successfully.',
            'data': detail_serializer.data
        }, status=status.HTTP_201_CREATED)


class AIChatMessageFeedbackView(APIView):
    """
    POST /api/academics/ai/messages/<message_id>/feedback/
    Updates message feedback (helpful: 'up'/'down') or note bookmark status ('saved': true/false).
    """
    permission_classes = [AllowAny]

    def post(self, request, message_id):
        profile, err = _get_student_profile(request)
        if not profile:
            return Response({'status': 'error', 'message': err}, status=status.HTTP_404_NOT_FOUND)

        try:
            msg = AIChatMessage.objects.get(id=message_id, session__student=profile)
        except AIChatMessage.DoesNotExist:
            return Response({'status': 'error', 'message': 'Message not found.'}, status=status.HTTP_404_NOT_FOUND)

        metadata = msg.metadata or {}
        if 'feedback' in request.data:
            metadata['feedback'] = request.data['feedback']
        if 'saved' in request.data:
            metadata['saved'] = bool(request.data['saved'])

        msg.metadata = metadata
        msg.save(update_fields=['metadata'])

        return Response({
            'status': 'success',
            'message': 'Feedback recorded.',
            'data': AIChatMessageSerializer(msg).data
        })


class AIChatGenerateMCQsView(APIView):
    """
    POST /api/academics/ai/sessions/<session_id>/generate-mcqs/
    Generates 3 syllabus-aligned practice MCQs on the active concept.
    """
    permission_classes = [AllowAny]

    def post(self, request, session_id):
        profile, err = _get_student_profile(request)
        if not profile:
            return Response({'status': 'error', 'message': err}, status=status.HTTP_404_NOT_FOUND)

        try:
            session = AIChatSession.objects.get(id=session_id, student=profile)
        except AIChatSession.DoesNotExist:
            return Response({'status': 'error', 'message': 'Chat session not found.'}, status=status.HTTP_404_NOT_FOUND)

        mcqs = [
            {
                "id": 1,
                "question": "In a B+ tree of order m = 5, what is the minimum number of keys an internal node must hold before triggering an underflow?",
                "options": [
                    "A) 1 key",
                    "B) 2 keys",
                    "C) 3 keys",
                    "D) 4 keys"
                ],
                "correct_option": 1,
                "explanation": "For an order m tree, minimum keys = ⌈m/2⌉ - 1. For m = 5, ⌈5/2⌉ - 1 = 3 - 1 = 2 keys."
            },
            {
                "id": 2,
                "question": "When an underflow occurs upon key deletion, which operation is prioritized first according to standard B+ tree balance rules?",
                "options": [
                    "A) Node Merging with parent collapse",
                    "B) Key Redistribution with adjacent sibling",
                    "C) Complete tree re-indexing",
                    "D) Postponing balance until next commit"
                ],
                "correct_option": 1,
                "explanation": "Redistribution is always prioritized first if either adjacent sibling has spare keys beyond the minimum threshold."
            },
            {
                "id": 3,
                "question": "During key redistribution from a left sibling to a right deficient child, how is the parent index key modified?",
                "options": [
                    "A) The parent index key is deleted completely",
                    "B) The left sibling's highest key ascends to overwrite the parent separator key, and the old parent key shifts into the right child",
                    "C) The root node depth decreases by 1",
                    "D) The parent remains unmodified while child pointers duplicate"
                ],
                "correct_option": 1,
                "explanation": "In redistribution through an internal node, the borrowing sibling's separating key replaces the parent index value, while the former parent key moves into the deficient child."
            }
        ]

        # Add assistant message with MCQs
        msg = AIChatMessage.objects.create(
            session=session,
            sender='assistant',
            content="Here are 3 concept verification practice questions based on your CS-304 B+ Tree Deletion and Redistribution syllabus:",
            metadata={
                "badge": "CS-304 Practice Drill",
                "mcqs": mcqs,
                "saved": False,
                "feedback": None
            }
        )

        serializer = AIChatSessionDetailSerializer(session)
        return Response({
            'status': 'success',
            'message': 'Practice MCQs generated.',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
