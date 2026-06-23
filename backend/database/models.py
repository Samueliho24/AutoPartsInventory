import uuid
from datetime import datetime
from sqlalchemy import Uuid, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Part(Base):
    __tablename__ = "parts"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    part_number: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    location: Mapped[str | None] = mapped_column(String)
    description: Mapped[str | None] = mapped_column(String)
    stock: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.now
    )

    movements: Mapped[list["Movement"]] = relationship(back_populates="part", cascade="all, delete-orphan")


class Movement(Base):
    __tablename__ = "movements"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    part_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("parts.id"), nullable=False)
    type: Mapped[str] = mapped_column(String, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.now
    )

    part: Mapped["Part"] = relationship(back_populates="movements")
