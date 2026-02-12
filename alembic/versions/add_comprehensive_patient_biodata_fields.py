"""Add comprehensive patient biodata fields

Revision ID: add_biodata_fields
Revises: 
Create Date: 2025-02-12

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_biodata_fields'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add new columns to patient_biodata table
    op.add_column('patient_biodata', sa.Column('occupation', sa.String(length=200), nullable=True))
    op.add_column('patient_biodata', sa.Column('previous_surgeries', sa.Text(), nullable=True))
    op.add_column('patient_biodata', sa.Column('family_medical_history', sa.Text(), nullable=True))
    op.add_column('patient_biodata', sa.Column('previous_dental_treatments', sa.Text(), nullable=True))
    op.add_column('patient_biodata', sa.Column('gum_disease_history', sa.Text(), nullable=True))
    op.add_column('patient_biodata', sa.Column('dental_visit_frequency', sa.String(length=100), nullable=True))
    op.add_column('patient_biodata', sa.Column('oral_hygiene_habits', sa.Text(), nullable=True))
    op.add_column('patient_biodata', sa.Column('dental_trauma_history', sa.Text(), nullable=True))
    op.add_column('patient_biodata', sa.Column('smoking_tobacco_use', sa.String(length=200), nullable=True))
    op.add_column('patient_biodata', sa.Column('alcohol_consumption', sa.String(length=200), nullable=True))
    op.add_column('patient_biodata', sa.Column('diet_habits', sa.Text(), nullable=True))
    op.add_column('patient_biodata', sa.Column('insurance_provider', sa.String(length=200), nullable=True))
    op.add_column('patient_biodata', sa.Column('insurance_policy_number', sa.String(length=100), nullable=True))
    op.add_column('patient_biodata', sa.Column('consent_forms', sa.Text(), nullable=True))


def downgrade() -> None:
    # Remove columns from patient_biodata table
    op.drop_column('patient_biodata', 'consent_forms')
    op.drop_column('patient_biodata', 'insurance_policy_number')
    op.drop_column('patient_biodata', 'insurance_provider')
    op.drop_column('patient_biodata', 'diet_habits')
    op.drop_column('patient_biodata', 'alcohol_consumption')
    op.drop_column('patient_biodata', 'smoking_tobacco_use')
    op.drop_column('patient_biodata', 'dental_trauma_history')
    op.drop_column('patient_biodata', 'oral_hygiene_habits')
    op.drop_column('patient_biodata', 'dental_visit_frequency')
    op.drop_column('patient_biodata', 'gum_disease_history')
    op.drop_column('patient_biodata', 'previous_dental_treatments')
    op.drop_column('patient_biodata', 'family_medical_history')
    op.drop_column('patient_biodata', 'previous_surgeries')
    op.drop_column('patient_biodata', 'occupation')
